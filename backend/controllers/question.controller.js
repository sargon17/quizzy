const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

const fs = require("fs");

exports.questionsByQuizId = async (req, res) => {
  try {
    const questions = await Question.find({ quiz: req.params.id }).exec();

    // if (questions.length === 0) {
    //   res.status(400).json({ message: "No questions found" });
    // }

    res.status(200).json({
      message: "Questions retrieved successfully!",
      questions: questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  if (req.file) {
    const image = fs.readFileSync(req.file.path);
    const encode_image = image.toString("base64");
    const finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer.from(encode_image, "base64"),
    };
    req.body.image = finalImg.image;
    req.body.imageType = finalImg.contentType;
  }
  const question = new Question({
    quiz: req.params.id,
    text: req.body.text,
    image: req.body.image,
    imageType: req.body.imageType,
  });

  try {
    const savedQuestion = await question.save();
    res.status(200).json({
      message: "Question created successfully!",
      question: savedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
