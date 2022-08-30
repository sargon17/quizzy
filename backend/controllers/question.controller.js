const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

const fs = require("fs");

exports.questionsByQuizId = async (req, res) => {
  try {
    const q = await Question.find({ quiz: req.params.id })
      .populate("answers")
      .exec();

    res.status(200).json(q);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  //   console.log(req.file);
  //   console.log(req.body);

  let finalImg;
  if (req.file) {
    const image = fs.readFileSync(req.file.path);
    const encode_image = image.toString("base64");
    finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer.from(encode_image, "base64"),
    };
  }
  let question = new Question({
    quiz: req.params.id,
    text: req.body.text,
  });

  if (req.file) {
    question.image = finalImg.image;
    question.imageType = finalImg.contentType;
  }

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

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Question deleted successfully!" });
  } catch (err) {
    console.log(err);
  }
};
