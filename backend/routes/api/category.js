const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination");
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

const {
  allCategories,
  createCategory,
} = require("../../controllers/category.controller");

router.get("/", allCategories); // get all categories
router.post("/create", upload.single("image"), createCategory); // create category

module.exports = router;
