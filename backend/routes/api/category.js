const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  allCategories,
  createCategory,
} = require("../../controllers/category.controller");

router.get("/", allCategories); // get all categories
router.post("/create", upload.single("image"), createCategory); // create category

module.exports = router;
