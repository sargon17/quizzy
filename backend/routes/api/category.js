const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  allCategories,
  createCategory,
  categoriesByTitle,
} = require("../../controllers/category.controller");

router.get("/", allCategories); // get all categories
router.get("/title/:title", categoriesByTitle); // get categories by title
router.post("/create", upload.single("image"), createCategory); // create category

module.exports = router;
