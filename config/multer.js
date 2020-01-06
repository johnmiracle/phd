const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({}),
  destination: (req, file, cb) => {
    cb(null, "/public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpg|jpeg|png/)) {
      // You can always pass an error if something goes wrong:
      cb(new Error("I don't have a clue!"), false);
      return;
    }
    cb(null, true);
  }
});
