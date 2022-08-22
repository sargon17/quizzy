const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  createQuestion,
  questionsByQuizId,
  deleteQuestion,
} = require("../../controllers/question.controller");

const {
  answersByQuestionId,
  addAnswer,
  deleteAnswer,
  controlAnswers,
} = require("../../controllers/answer.controller");

const checkForPhoto = (req, res, next) => {
  if (req.file) {
    upload.single("image");
  } else {
    next();
  }
};
// http://localhost:5000/api/qa
router.get("/:id", questionsByQuizId); // get questions by quiz id
router.post("/:id", upload.single("image"), createQuestion); // create question
router.delete("/:id", deleteQuestion); // delete question

router.get("/answers/:id", answersByQuestionId); // get answers by question id
router.post("/answers/control", controlAnswers); // control answers
router.post("/answers/:id", addAnswer); // get answers by question id
router.delete("/answers/:id", deleteAnswer); // delete answer

module.exports = router;
