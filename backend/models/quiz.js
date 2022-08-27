/* jslint es6 */
"global require";
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Subcategory is required"],
    },
    createdAt: { type: Date, default: Date.now },
    image: {
      type: Buffer,
    },
    imageType: {
      type: String,
    },
    description: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

quizSchema.virtual("imagePath").get(function () {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(
      "base64"
    )}`;
  }
});

module.exports = mongoose.model("Quiz", quizSchema);
