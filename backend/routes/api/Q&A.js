const express = require("express");
const router = express.Router();

const upload = require("../../utils/storage");

const {
  createQuestion,
  questionsByQuizId,
} = require("../../controllers/question.controller");

const checkForPhoto = (req, res, next) => {
  if (req.file) {
    upload.single("image");
  } else {
    next();
  }
};
router.get("/:id", questionsByQuizId); // get questions by quiz id
router.post("/:id", upload.single("image"), createQuestion); // create question

module.exports = router;
