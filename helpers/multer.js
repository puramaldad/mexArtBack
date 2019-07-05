const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name:process.env.CLOUDNAME,
  api_key:process.env.CLOUDKEY,
  api_secret:process.env.CLOUDSECRET,
})

const storage = cloudinaryStorage({
  cloudinary,
  folder:'profileapp',
  allowedFormats:['jpg','png','jpeg'],
  filename: function(req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  },
})


module.exports = multer({ storage });