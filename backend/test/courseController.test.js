const request = require('supertest');
const app = require('../api/server'); // Adjust path as needed
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinaryConfig');
const sharp = require('sharp');
const stream = require("stream");

// Mock cloudinary uploader
jest.mock('../utils/cloudinaryConfig', () => ({
    uploader: {
        upload_stream: jest.fn((options, cb) => {
            // Simulate cloudinary upload_stream
            const stream = require('stream');
            const writable = new stream.Writable();
            writable._write = (chunk, encoding, done) => done();
            process.nextTick(() => cb(null, { secure_url: 'http://cloudinary/test-file' }));
            return writable;
        }),
        destroy: jest.fn(),
    },
}));

// Mock sharp
jest.mock('sharp', () => {
    return jest.fn(() => ({
        metadata: jest.fn().mockResolvedValue({ width: 1000 }), // Default width
    }));
});

// Mock Course model
jest.mock('../models/Course', () => {
    const MockCourse = jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: 'mocked_id' }),
    }));
    MockCourse.findById = jest.fn();
    return MockCourse;
});

describe('Course Controller', () => {
    describe('POST /courses', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should create a course with image and files', async () => {
            const res = await request(app)
                .post('/courses')
                .field('title', 'Test Course')
                .field('description', 'Test Description')
                .field('videoLink', 'https://youtube.com/test')
                .field('article', 'Test Article')
                .field('createdBy', 'user123')
                .field('publish', 'true')
                .attach('img', Buffer.from([0xff, 0xd8, 0xff]), 'test.jpg')
                .attach('files', Buffer.from('test file content'), 'test.pdf');

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({ id: 'mocked_id', message: 'Course added successfully' });
            expect(Course).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Test Course',
                    img: 'http://cloudinary/test-file',
                    files: 'http://cloudinary/test-file',
                })
            );
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app)
                .post('/courses')
                .field('description', 'Test Description');

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'Title is required' });
        });

        it('should return 400 if image width is less than 850px', async () => {
            // Change sharp mock for this test
            require('sharp').mockImplementationOnce(() => ({
                metadata: jest.fn().mockResolvedValue({ width: 800 }),
            }));

            const res = await request(app)
                .post('/courses')
                .field('title', 'Test Course')
                .attach('img', Buffer.from([0xff, 0xd8, 0xff]), 'test.jpg');

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'The image width must be at least 850px' });
        });
    });


    jest.mock('../utils/cloudinaryConfig', () => ({
        uploader: {
            upload_stream: jest.fn((options, cb) => {
                const stream = require('stream');
                const writable = new stream.Writable();
                writable._write = (chunk, encoding, done) => done();
                process.nextTick(() => cb(null, { secure_url: 'http://cloudinary/updated-file' }));
                return writable;
            }),
        },
    }));

    jest.mock('sharp', () => {
        return jest.fn(() => ({
            metadata: jest.fn().mockResolvedValue({ width: 1000 }), // default width
        }));
    });

    const mockCourse = {
        _id: 'existing_id',
        title: 'Old Title',
        description: 'Old Desc',
        video_link: 'old_link',
        article: 'Old article',
        img: 'old_img',
        files: 'old_files',
        publish: false,
        save: jest.fn().mockResolvedValue(true),
    };


    
    
    describe('PUT /courses/:id (updateCourse)', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should update a course with new image and files', async () => {
            Course.findById.mockResolvedValue({ ...mockCourse, save: jest.fn().mockResolvedValue(true) });

            const res = await request(app)
                .put('/courses/existing_id')
                .field('_id', 'existing_id')
                .field('title', 'Updated Title')
                .field('description', 'Updated Desc')
                .field('videoLink', 'https://youtube.com/updated')
                .field('article', 'Updated Article')
                .field('publish', 'true')
                .attach('img', Buffer.from([0xff, 0xd8, 0xff]), 'updated.jpg')
                .attach('files', Buffer.from('updated file'), 'updated.pdf');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Course updated successfully' });
            expect(Course.findById).toHaveBeenCalledWith('existing_id');
        });

        it('should return 400 if _id is missing', async () => {
            const res = await request(app)
                .put('/courses/any_id')
                .field('title', 'Updated Title');

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'ID and title are required' });
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app)
                .put('/courses/any_id')
                .field('_id', 'existing_id');

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'ID and title are required' });
        });

        it('should return 404 if course not found', async () => {
            Course.findById.mockResolvedValue(null);

            const res = await request(app)
                .put('/courses/nonexistent_id')
                .field('_id', 'nonexistent_id')
                .field('title', 'Any Title');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ error: 'Course not found' });
        });

        it('should return 400 if image width is less than 850px', async () => {
            sharp.mockImplementationOnce(() => ({
                metadata: jest.fn().mockResolvedValue({ width: 800 }),
            }));
            Course.findById.mockResolvedValue({ ...mockCourse, save: jest.fn().mockResolvedValue(true) });

            const res = await request(app)
                .put('/courses/existing_id')
                .field('_id', 'existing_id')
                .field('title', 'Updated Title')
                .attach('img', Buffer.from([0xff, 0xd8, 0xff]), 'updated.jpg');

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'The image width must be at least 850px' });
        });
    });

    describe('DELETE /courses/:id (deleteCourse)', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should delete a course and its associated files', async () => {
            // Mock course with image and files
            const mockCourse = {
                _id: 'course_id',
                img: 'http://cloudinary.com/courses/images/testimg.jpg',
                files: 'http://cloudinary.com/courses/files/testfile1.pdf,http://cloudinary.com/courses/files/testfile2.pdf',
            };
            Course.findById.mockResolvedValue(mockCourse);
            Course.findByIdAndDelete = jest.fn().mockResolvedValue(mockCourse);

            const res = await request(app).delete('/courses/course_id');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Course deleted successfully along with associated files' });
            expect(Course.findById).toHaveBeenCalledWith('course_id');
            expect(Course.findByIdAndDelete).toHaveBeenCalledWith('course_id');
            // Check cloudinary destroy called for image
            expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
                expect.stringContaining('courses/images/'),
                { resource_type: 'image' }
            );
            // Check cloudinary destroy called for each file
            expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
                expect.stringContaining('courses/files/'),
                { resource_type: 'raw' }
            );
            expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(3); // 1 image + 2 files
        });

        it('should return 404 if course not found', async () => {
            Course.findById.mockResolvedValue(null);

            const res = await request(app).delete('/courses/nonexistent_id');

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ error: 'Course not found' });
            expect(Course.findById).toHaveBeenCalledWith('nonexistent_id');
            // No deletion or cloudinary calls
            expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
        });

        it('should handle internal server error', async () => {
            Course.findById.mockRejectedValue(new Error('DB error'));

            const res = await request(app).delete('/courses/course_id');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to delete course' });
        });
    });
});
