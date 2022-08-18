const Category = require("../models/category");
const SubCategory = require("../models/sub_category");

const fs = require("fs");

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({})
      .populate("category")
      .exec();
    res.status(200).json({
      message: "Sub Categories retrieved successfully!",
      subCategories: subCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
exports.subCategoriesByCategory = async (req, res) => {
  let subCategories;
  try {
    let c = await SubCategory.find({ category: req.params.categoryID })
      .populate("category")
      .exec();

    subCategories = c.map((subCategory) => {
      return {
        id: subCategory.id,
        title: subCategory.title,
        image: subCategory.imagePath,
        category: subCategory.category,
      };
    });
    res.status(200).json({
      message: "Sub Categories retrieved successfully!",
      subCategories: subCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createSubCategory = async (req, res) => {
  const image = fs.readFileSync(req.file.path);
  const encode_image = image.toString("base64");
  const finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer.from(encode_image, "base64"),
  };
  let subCategory = new SubCategory({
    title: req.body.title,
    image: finalImg.image,
    imageType: finalImg.contentType,
    category: req.body.categoryID,
  });

  try {
    await subCategory.save();
    res.status(200).json({
      message: "Sub Category created successfully!",
      subCategory: subCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
