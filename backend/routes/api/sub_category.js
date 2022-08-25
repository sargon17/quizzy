const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  getSubCategories,
  subCategoriesByCategory,
  createSubCategory,
  subCategoriesByCategoryAndTitle,
} = require("../../controllers/sub_category.controller");

// router.get("/", getSubCategories);
router.post("/create", upload.single("image"), createSubCategory);
router.get("/:categoryID", subCategoriesByCategory);
router.get("/title/:title/:categoryID", subCategoriesByCategoryAndTitle);

module.exports = router;
