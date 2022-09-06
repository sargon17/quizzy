const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz is required"],
    },
    text: {
      type: String,
      required: [true, "Text is required"],
    },
    image: {
      type: Buffer,
    },
    imageType: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    totalTimesPlayed: {
      type: Number,
      default: 0,
    },
    totalTimesSuccess: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

questionSchema.virtual("imagePath").get(function () {
  if (this.image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(
      "base64"
    )}`;
  }
});

questionSchema.pre("remove", async function (next) {
  try {
    await Answer.deleteMany({ question: this._id });
  } catch (error) {
    next(error);
  }
});

questionSchema.virtual("passingRate").get(function () {
  if (this.totalTimesPlayed > 0) {
    return Math.round((this.totalTimesSuccess / this.totalTimesPlayed) * 100);
  } else {
    return null;
  }
});

module.exports = mongoose.model("Question", questionSchema);
