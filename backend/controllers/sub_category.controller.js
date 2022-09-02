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
    let s = await SubCategory.find({ category: req.params.categoryID })
      .populate({
        path: "category",
        select: "title",
      })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(s);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.subCategoriesByCategoryAndTitle = async (req, res) => {
  let query = SubCategory.find({ category: req.params.categoryID });

  if (req.params.title != null && req.params.title != "") {
    query = query.regex("title", new RegExp(req.params.title, "i"));
  }
  try {
    const s = await query.exec();

    subCategories = s.map((subCategory) => {
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

  let category = await Category.findById(req.body.categoryID);

  try {
    await subCategory.save();

    category.subCategories.push(subCategory._id);
    await category.save();
    res.status(200).json({
      message: "Sub Category created successfully!",
      subCategory: subCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
