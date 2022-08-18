const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

const fs = require("fs");

exports.answersByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.id }).exec();
    res.status(200).json({
      message: "Answers retrieved successfully!",
      answers: answers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAnswer = async (req, res) => {
  const answer = new Answer({
    question: req.params.id,
    text: req.body.text,
    state: req.body.state,
  });

  try {
    const savedAnswer = await answer.save();
    res.status(200).json({
      message: "Answer created successfully!",
      answer: savedAnswer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    await Answer.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Answer deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
