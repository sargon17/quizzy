const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

// utils
const saveImage = require("../utils/saveImage");

// get quizzes
exports.allQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).exec();
    res.status(200).json({
      message: "Quizzes retrieved successfully!",
      quizzes: quizzes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.quizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).exec();
    // console.log(quiz);
    res.status(200).json({
      message: "Quiz retrieved successfully!",
      quiz: quiz,
    });
  } catch (error) {
    if (!quiz) {
      res.status(400).json({ message: "Quiz not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  let quiz = new Quiz({
    title: req.body.title,
    description: req.body.description,
    // subCategory: req.subCategory,
  });
  let creator;
  try {
    creator = await User.findOne({ _id: req.body.userID }).exec();
    quiz.creator = creator.id;
    await quiz.save();
    res.status(200).json({
      message: "Quiz created successfully!",
      quiz: quiz,
    });
  } catch (err) {
    if (!creator) {
      res.status(400).json({ message: "Invalid userID" });
    }
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// delete quiz
exports.deleteQuiz = async (req, res) => {
  let quiz;
  let user;
  try {
    quiz = await Quiz.findById(req.params.id).exec();
    user = await User.findOne({ _id: req.params.userID }).exec();
    if (user.id !== quiz.creator.toString()) {
      console.log(
        "userID: " +
          user.id +
          typeof user.id +
          " quiz creator: " +
          quiz.creator +
          typeof quiz.creator.toString()
      );
      res.status(403).json({ message: "User is not authorized" });
    } else {
      await quiz.remove();
      res.status(200).json({
        message: "Quiz deleted successfully!",
      });
    }
  } catch (error) {
    if (!quiz) {
      res.status(400).json({ message: "Quiz not found" });
    }
    if (!user) {
      res.status(400).json({ message: "Invalid userID" });
    }
    res.status(500).json({ message: error.message });
  }
};
