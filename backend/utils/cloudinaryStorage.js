// utils/cloudinaryStorage.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'courses/img',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, crop: 'limit' }]
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'courses/files',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'pptx', 'zip'],
  },
});

module.exports = { imageStorage, fileStorage };
