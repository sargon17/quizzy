const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

const fs = require("fs");

// utils
const saveImage = require("../utils/saveImage");

// get quizzes
exports.allQuizzes = async (req, res) => {
  try {
    const q = await Quiz.find({}).populate("subCategory").exec();

    let quizzes = q.map((quiz) => {
      return {
        id: quiz.id,
        creator: quiz.creator,
        title: quiz.title,
        description: quiz.description,
        subCategory: quiz.subCategory,
        image: quiz.imagePath,
      };
    });

    res.status(200).json({
      message: "Quizzes retrieved successfully!",
      quizzes: quizzes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.quizById = async (req, res) => {
  console.log(req.params.id);
  try {
    let q = await Quiz.findById(req.params.id)
      .populate([
        {
          path: "creator",
          model: "User",
        },
        {
          path: "subCategory",
          model: "SubCategory",
          populate: {
            path: "category",
            model: "Category",
          },
        },
      ])
      .exec();

    quiz = {
      id: q.id,
      title: q.title,
      description: q.description,
      subCategory: q.subCategory,
      image: q.imagePath,
      creator: q.creator,
      questions: q.questions,
    };
    // console.log(quiz);
    res.status(200).json({
      message: "Quiz retrieved successfully!",
      quiz: quiz,
    });
  } catch (error) {
    // if (!quiz) {
    //   res.status(400).json({ message: "Quiz not found" });
    // }
    res.status(500).json({ message: error.message });
  }
};

exports.quizByCreator = async (req, res) => {
  console.log(typeof req.params.id);

  try {
    let user = await User.findById(req.params.id).exec();
    console.log(user.id, req.params.id, user.id === req.params.id);

    let q = await Quiz.find({ creator: req.params.id })
      .populate("subCategory")
      .sort({ createdAt: -1 })
      .exec();

    let quizzes = q.map((quiz) => {
      return {
        id: quiz.id,
        creator: quiz.creator,
        title: quiz.title,
        description: quiz.description,
        subCategory: quiz.subCategory,
        image: quiz.imagePath,
        createdAt: quiz.createdAt.toISOString().split("T")[0],
      };
    });
    // console.log(quiz);
    res.status(200).json({
      message: "Quiz retrieved successfully!",
      quizzes: quizzes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.quizBySubCategory = async (req, res) => {
  try {
    let q = await Quiz.find({ subCategory: req.params.id })
      .populate([
        {
          path: "subCategory",
          model: "SubCategory",
          populate: {
            path: "category",
            model: "Category",
          },
        },
        "creator",
      ])
      .exec();

    let quizzes = q.map((quiz) => {
      return {
        id: quiz.id,
        creator: quiz.creator,
        title: quiz.title,
        description: quiz.description,
        subCategory: quiz.subCategory,
        image: quiz.imagePath,
      };
    });
    // console.log(quiz);
    res.status(200).json({
      message: "Quiz retrieved successfully!",
      quizzes: quizzes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  const image = fs.readFileSync(req.file.path);
  const encode_image = image.toString("base64");
  const finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer.from(encode_image, "base64"),
  };
  let quiz = new Quiz({
    title: req.body.title,
    description: req.body.description,
    subCategory: req.body.subCategoryID,
    image: finalImg.image,
    imageType: finalImg.contentType,
  });
  let creator;
  try {
    creator = await User.findOne({ _id: req.body.creatorID }).exec();
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
