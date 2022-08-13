const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");
const Category = require("../models/category");

const fs = require("fs");

// utils
const saveImage = require("../utils/saveImage");
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];
exports.allCategories = async (req, res) => {
  try {
    let categories = await Category.find({}).exec();

    res.status(200).json({
      message: "Categories retrieved successfully!",
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const image = fs.readFileSync(req.file.path);
  const encode_image = image.toString("base64");
  const finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer.from(encode_image, "base64"),
  };
  let category = new Category({
    title: req.body.title,
    image: finalImg.image,
    imageType: finalImg.contentType,
  });

  try {
    await category.save();
    res.status(200).json({
      message: "Category created successfully!",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
