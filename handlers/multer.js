const multer = require('multer');

//multer.diskStorage() creates a storage space for storing files.
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, "./public/uploads/");
    } else {
      cb({ message: "this file is neither a video or image file" }, false);
    }
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

module.exports = upload = multer({ storage: storage }).single("image");