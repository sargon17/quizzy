const Category = require("../models/category");
const SubCategory = require("../models/sub_category");

const fs = require("fs");

exports.allSubCategories = async (req, res) => {
  console.log("allSubCategories: " + req.params.categoryID);
  let subCategories;
  try {
    let c = await SubCategory.find({ category: req.params.categoryID }).exec();

    subCategories = await c.map(async (subCategory) => {
      result = {
        id: subCategory._id,
        title: subCategory.title,
        image: subCategory.imagePath,
        imageType: subCategory.imageType,
      };
      result.category = await Category.findById(subCategory.category).exec();
      return result;
    });

    res.status(200).json({
      message: "Sub Categories retrieved successfully!",
      subCategories: subCategories,
    });
  } catch (error) {
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
