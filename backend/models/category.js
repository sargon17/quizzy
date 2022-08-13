const mongoose = require("mongoose");

const SubCategory = require("./sub_category");

const categorySchema = new mongoose.Schema({
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
});

categorySchema.virtual("imagePath").get(function () {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(
      "base64"
    )}`;
  }
});

categorySchema.pre("remove", async function (next) {
  try {
    await SubCategory.deleteMany({ category: this._id });
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);
