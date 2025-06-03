const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'name',
  api_key: 'key',
  api_secret: 'secret'
});

module.exports = cloudinary;
