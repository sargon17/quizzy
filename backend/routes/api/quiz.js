const express = require("express");
const router = express.Router();
// const verifyToken = require("../../middlewares/authJWT");

const {
  allQuizzes,
  quizById,
  createQuiz,
  deleteQuiz,
} = require("../../controllers/quiz.controller");

router.get("/all", allQuizzes); // get all quizzes
router.post("/create", createQuiz); // create quiz
router.get("/:id", quizById); // get quiz by id
router.delete("/:id/:userID", deleteQuiz); // delete quiz

// router.get("/secret", verifyToken, (req, res) => {
//   "use strict";
//   if (!req.user) {
//     res.status(403).json({ message: "Invalid token" });
//   }
//   res.status(200).json({ message: "This is a secret content" });
// });

module.exports = router;