const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const Course = require('../models/Course');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinaryConfig');

// Використовуємо multer.memoryStorage() для доступу до buffer
const upload = multer({ storage: multer.memoryStorage() }).fields([
    { name: 'img', maxCount: 1 },
    { name: 'files', maxCount: 10 }
]);

// Обгортка в проміс
const uploadPromise = (req, res) => new Promise((resolve, reject) => {
    upload(req, res, (err) => err ? reject(err) : resolve());
});

// Завантаження буферу на Cloudinary
const uploadToCloudinary = (buffer, folder, filename, file) => {
    console.log(" filename, file: ", filename, file?.originalname);
    return new Promise((resolve, reject) => {
        // Отримуємо розширення файлу
        const fileExtension = (typeof file === 'undefined') ? '' : path.extname(file.originalname); // Отримаємо ".pdf"

        const uniqueName = `file_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;  // Додаємо розширення до імені файлу
        
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: uniqueName, // Використовуємо унікальне ім'я
                resource_type: "raw"  // Для звичайних файлів
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);  // Повертаємо URL файлу
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);  // Завантаження на Cloudinary
    });
};


exports.createCourse = async (req, res) => {
    try {
        await uploadPromise(req, res);

        const { title, description = '', videoLink, article = '', createdBy, publish } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        let imgUrl = null;

        if (req.files?.img?.[0]) {
            const imgBuffer = req.files.img[0].buffer;
            const metadata = await sharp(imgBuffer).metadata();

            if (metadata.width < 850) {
                return res.status(400).json({ error: 'The image width must be at least 850px' });
            }

            // Завантаження зображення
            imgUrl = await uploadToCloudinary(imgBuffer, 'courses/images', `img_${Date.now()}`);
        }

        // Завантаження файлів
        const fileUrls = [];
        if (req.files?.files) {
            for (const file of req.files.files) {
                const fileUrl = await uploadToCloudinary(file.buffer, 'courses/files', `file_${Date.now()}_${Math.random().toString(36).substring(7)}`, file);
                fileUrls.push(fileUrl);
            }
        }

        const newCourse = new Course({
            title,
            description,
            article,
            video_link: videoLink || null,
            img: imgUrl,
            files: fileUrls.join(','),
            created_by: createdBy,
            publish
        });

        const savedCourse = await newCourse.save();
        res.status(201).json({ id: savedCourse._id, message: 'Course added successfully' });
    } catch (error) {
        console.error('Error in createCourse:', error);
        res.status(500).json({ error: 'Failed to add course' });
    }
};




exports.updateCourse = async (req, res) => {
    try {
        await uploadPromise(req, res);

        const { _id, title, description = '', videoLink, article = '', publish } = req.body;

        if (!_id || !title) {
            return res.status(400).json({ error: 'ID and title are required' });
        }

        const course = await Course.findById(_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Завантаження зображення
        if (req.files?.img?.[0]) {
            const imgBuffer = req.files.img[0].buffer;
            const metadata = await sharp(imgBuffer).metadata();

            if (metadata.width < 850) {
                return res.status(400).json({ error: 'The image width must be at least 850px' });
            }

            const imgUrl = await uploadToCloudinary(imgBuffer, 'courses/images', `img_${Date.now()}`);
            course.img = imgUrl;
        }

        // Завантаження файлів
        if (req.files?.files) {
            const fileUrls = [];
            for (const file of req.files.files) {
                const fileUrl = await uploadToCloudinary(file.buffer, 'courses/files', `file_${Date.now()}_${Math.random().toString(36).substring(7)}`, file);
                fileUrls.push(fileUrl);
            }
            course.files = fileUrls.join(',');
        }

        // Інші поля
        course.title = title;
        course.description = description;
        course.video_link = videoLink || null;
        course.article = article;
        course.publish = publish !== undefined ? publish : course.publish;

        await course.save();

        res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error in updateCourse:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
};





const deleteFromCloudinary = async (url) => {
    try {
        const publicId = url.split('/').slice(-1)[0].split('.')[0]; // Можна адаптувати
        await cloudinary.uploader.destroy(`courses/images/${publicId}`, { resource_type: 'image' });
    } catch (err) {
        console.warn('Failed to delete from Cloudinary:', err.message);
    }
};

const deleteRawFileFromCloudinary = async (url) => {
    try {
        const publicId = url.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`courses/files/${publicId}`, { resource_type: 'raw' });
    } catch (err) {
        console.warn('Failed to delete file from Cloudinary:', err.message);
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const { img, files } = course;

        // Видаляємо курс
        await Course.findByIdAndDelete(id);

        // Видаляємо зображення
        if (img) await deleteFromCloudinary(img);

        // Видаляємо файли
        if (files) {
            const fileUrls = files.split(',');
            for (const fileUrl of fileUrls) {
                await deleteRawFileFromCloudinary(fileUrl);
            }
        }

        res.status(200).json({ message: 'Course deleted successfully along with associated files' });
    } catch (error) {
        console.error('Error in deleteCourse:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};










// Отримати всі курси
exports.getCourses = async (req, res) => {
    try {
        // Знайдемо всі курси
        const courses = await Course.find();

        // Якщо курси не знайдені
        if (!courses.length) {
            return res.status(404).json({ error: 'No courses found' });
        }

        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};


// Отримання курсу за ID
exports.getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        // Знаходимо курс за ID
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
};



exports.getTeacherCourses = async (req, res) => {
    const { id } = req.params;

    try {
        // Знайти курси, де "created_by" дорівнює "id"
        const courses = await Course.find({ created_by: id });

        if (courses.length === 0) {
            return res.status(404).json({ error: 'No courses found for this teacher' });
        }

        res.status(200).json(courses);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to fetch courses' });
    }
};