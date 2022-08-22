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

    const question = await Question.findById(req.params.id);
    question.answers = [...question.answers, savedAnswer.id];
    const savedQuestion = await question.save();
    console.log(savedQuestion.answers);

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
    const answer = await Answer.findById(req.params.id);

    const question = await Question.findById(answer.question);
    question.answers = question.answers.filter((answerId) => {
      console.log(answerId.toString(), answer.id);
      return answerId != answer.id;
    });

    const savedQuestion = await question.save();
    console.log(savedQuestion.answers);
    await Answer.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Answer deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.controlAnswers = async (req, res) => {
  console.log(req.body.answers);
  let correctAnswers = 0;
  let correctQuestionId = [];
  try {
    for (let i = 0; i < req.body.answers.length; i++) {
      const question = await Question.findById(req.body.answers[i].question)
        .populate("answers")
        .exec();
      question.answers.forEach((answer) => {
        if (answer.id == req.body.answers[i].response) {
          console.log(answer.id, answer.stat);
          if (answer.state) {
            correctAnswers++;
            correctQuestionId.push(answer.question);
          }
        }
      });
    }
    res.status(200).json({
      message: "Answers checked successfully!",
      correctAnswers: correctAnswers,
      correctQuestionId: correctQuestionId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
