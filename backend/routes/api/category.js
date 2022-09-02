const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  allCategories,
  createCategory,
  categoriesByTitle,
  deleteCategory,
  categoryById,
} = require("../../controllers/category.controller");

router.get("/", allCategories); // get all categories
router.get("/id/:id", categoryById); // get categories by title
router.get("/title/:title", categoriesByTitle); // get categories by title
router.post("/create", upload.single("image"), createCategory); // create category
router.delete("/delete/:id", deleteCategory); // delete category

module.exports = router;
