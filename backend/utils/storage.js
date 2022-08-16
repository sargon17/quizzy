const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("destination");
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
