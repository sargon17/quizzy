const mongoose = require("mongoose");

const Category = require("./category");

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: Buffer,
    required: [true, "Cover image is required"],
  },
  imageType: {
    type: String,
    required: [true, "Cover image type is required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
});

subCategorySchema.virtual("imagePath").get(function () {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(
      "base64"
    )}`;
  }
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
