const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: [true, "Question is required"],
  },
  text: {
    type: String,
    required: [true, "Text is required"],
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Answer", answerSchema);
