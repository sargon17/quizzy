const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/authJWT");
const upload = require("../../utils/storage");

const {
  allQuizzes,
  quizById,
  quizByCreator,
  quizBySubCategory,
  createQuiz,
  deleteQuiz,
  lastQuizByCreator,
  updateQuiz,
  quizSaveStats,
  likeQuiz,
} = require("../../controllers/quiz.controller");

// http://localhost:5000/api/quiz
router.get("/all", allQuizzes); // get all quizzes
router.get("/all/:id", quizByCreator); // get quiz by id")
router.get("/last/:id", lastQuizByCreator); // get last quiz by id")
router.get("/sub-category/:id", quizBySubCategory); // get quiz by id")
router.post("/create", upload.single("image"), createQuiz); // create quiz
router.get("/:id", quizById); // get quiz by id
router.put("/:id", verifyToken, upload.single("image"), updateQuiz); // delete quiz by id
router.delete("/:id/:userID", deleteQuiz); // delete quiz
router.put("/stats/:id", quizSaveStats); // save quiz stats
router.put("/like/:id", likeQuiz); // save likes

// router.get("/secret", verifyToken, (req, res) => {
//   "use strict";
//   if (!req.user) {
//     res.status(403).json({ message: "Invalid token" });
//   }
//   res.status(200).json({ message: "This is a secret content" });
// });

module.exports = router;
