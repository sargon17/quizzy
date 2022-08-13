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
  allSubCategories,
  createSubCategory,
} = require("../../controllers/sub_category.controller");

router.post("/create", upload.single("image"), createSubCategory);
router.get("/:categoryID", allSubCategories);

module.exports = router;
