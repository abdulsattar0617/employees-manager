const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
      cb(null, true);
    } else {
      console.log("only jpg & png file supported!");
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});
