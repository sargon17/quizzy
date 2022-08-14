const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  getSubCategories,
  subCategoriesByCategory,
  createSubCategory,
} = require("../../controllers/sub_category.controller");

// router.get("/", getSubCategories);
router.post("/create", upload.single("image"), createSubCategory);
router.get("/:categoryID", subCategoriesByCategory);

module.exports = router;
