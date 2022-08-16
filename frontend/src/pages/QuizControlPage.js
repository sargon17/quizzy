import React from "react";

import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import LoadImage from "../components/loadImage";

import checkUserAuth from "../utils/checkUserAuth";

export default function QuizControlPage() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const { quizID } = useParams();
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    quizID: quizID,
  });

  const [image, setImage] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (!checkUserAuth(cookies)) {
        window.location.href = "/dashboard/" + cookies.user.userName;
      }
    }
  }, []);

  const getQuiz = async () => {
    try {
      const res = await axios.get(BACKEND_URL + "/api/quiz/" + quizID);
      setQuiz(res.data.quiz);
      console.log(res.data.quiz);
    } catch (err) {
      console.log(err);
    }
  };

  const getQuestions = async () => {
    try {
      const res = await axios.get(BACKEND_URL + "/api/qa/" + quizID);
      setQuestions(res.data.questions);
      console.log(res.data.questions);
    } catch (err) {
      console.log(err);
    }
  };

  const addQuestion = async () => {
    console.table(newQuestion, image);

    const formData = new FormData();
    formData.append("text", newQuestion.text);
    if (image.length > 0) {
      formData.append("image", image[0].file);
    }

    try {
      const res = await axios.post(BACKEND_URL + "/api/qa/" + quizID, formData);
      setQuestions(res.data.questions);
      setNewQuestion({});
      getQuestions();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getQuiz();
    getQuestions();
  }, []);

  return (
    <>
      <h1>You are working on Quiz {quiz.text}</h1>
      <img src={quiz.image} alt={quiz.text} width="400" />
      <p>{quiz.description}</p>
      <h2>Questions</h2>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Number</th>
            <th>Image</th>
            <th>Question</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions &&
            questions.map((question, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{question.image ? "yes" : "no"}</td>
                <td>{question.text}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          <tr>
            <td>Add Question</td>
            <td>
              <LoadImage setImage={setImage} />
            </td>
            <td>
              <textarea
                id="question"
                onChange={(e) =>
                  setNewQuestion((prev) => {
                    return { ...prev, text: e.target.value };
                  })
                }
              >
                {newQuestion.text}
              </textarea>
            </td>
            <td>
              <button onClick={addQuestion}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
