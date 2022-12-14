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
    published: {
      type: Boolean,
      default: false,
    },
    totalTimesPlayed: {
      type: Number,
      default: 0,
    },
    totalTimesSuccess: {
      type: Number,
      default: 0,
    },
    percentageToSuccess: {
      type: Number,
      default: 60,
    },
    likes: {
      type: Number,
      default: 0,
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

quizSchema.virtual("passingRate").get(function () {
  if (this.totalTimesPlayed > 0) {
    return Math.round((this.totalTimesSuccess / this.totalTimesPlayed) * 100);
  } else {
    return 0;
  }
});

quizSchema.virtual("from").get(function () {
  return this.createdAt.toLocaleDateString();
});

module.exports = mongoose.model("Quiz", quizSchema);
