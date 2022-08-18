const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
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
  totalAnswers: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
  answers: [],
});

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

module.exports = mongoose.model("Question", questionSchema);
