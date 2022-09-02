const mongoose = require("mongoose");

const Quiz = require("./quiz");
const Category = require("./category");

const subCategorySchema = new mongoose.Schema(
  {
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
    quizzes: [],
  },
  {
    toJSON: { virtuals: true },
  }
);

subCategorySchema.virtual("imagePath").get(function () {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(
      "base64"
    )}`;
  }
});

subCategorySchema.pre("remove", async function (next) {
  try {
    await Quiz.deleteMany({ subCategory: this._id });
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
