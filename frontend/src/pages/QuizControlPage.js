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
  const [addQuestionField, setAddQuestionField] = useState(false);
  const [editQuestionField, setEditQuestionField] = useState({
    question: {},
    state: false,
  });
  const [questions, setQuestions] = useState([]);

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    quizID: quizID,
  });
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({
    text: "",
    state: false,
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
      getQuestions();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteQuestion = async (questionID) => {
    try {
      const res = await axios.delete(BACKEND_URL + "/api/qa/" + questionID);
      console.log(res);
      getQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  const getAnswers = async (questionID) => {
    try {
      const res = await axios.get(
        BACKEND_URL + "/api/qa/answers/" + questionID
      );
      console.log(res.data.answers);
      setAnswers(res.data.answers);
    } catch (error) {
      console.log(error);
    }
  };

  const addAnswer = () => {
    console.table("newAnswer", newAnswer.text, newAnswer.state);

    // const formData = new FormData();

    // formData.append("text", newAnswer.text);
    // formData.append("state", newAnswer.state);

    // console.log(formData);
    fetch(
      "http://localhost:5000/api/qa/answers/" + editQuestionField.question.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newAnswer.text,
          state: newAnswer.state,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        getAnswers(editQuestionField.question.id);
        newAnswer.text = "";
        newAnswer.state = false;
      })
      .catch((err) => console.log(err));
  };
  const deleteAnswer = async (answerID) => {
    console.log(answerID);
    try {
      const res = await axios.delete(
        BACKEND_URL + "/api/qa/answers/" + answerID
      );
      console.log(res);
      getAnswers(editQuestionField.question.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuiz();
    getQuestions();
  }, []);

  return (
    <>
      <h1>You are working on Quiz {quiz.title}</h1>
      <img src={quiz.image} alt={quiz.title} width="400" />
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
                <td>
                  <img src={question.image} alt={question.text} width="200px" />
                </td>
                <td>{question.text}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditQuestionField({
                        question: question,
                        state: true,
                      });
                      getAnswers(question.id);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteQuestion(question.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {addQuestionField && (
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
                <button onClick={() => setAddQuestionField(false)}>
                  Return
                </button>
              </td>
            </tr>
          )}
          {!addQuestionField && (
            <tr>
              <td colSpan="4">
                <button onClick={() => setAddQuestionField(true)}>
                  Add Question
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Edit question */}
      {editQuestionField.state && (
        <div>
          <h2>Edit Question {editQuestionField.question.text}</h2>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Number</th>
                <th>Answer</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {answers &&
                answers.map((answer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{answer.text}</td>
                    <td>{answer.state ? "True" : "False"}</td>
                    <td>
                      <button onClick={() => deleteAnswer(answer._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              <tr>
                <td>Add Answer</td>
                <td>
                  <textarea
                    id="answer"
                    onChange={(e) =>
                      setNewAnswer((prev) => {
                        return { ...prev, text: e.target.value };
                      })
                    }
                  >
                    {newAnswer.text}
                  </textarea>
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setNewAnswer((prev) => {
                        return { ...prev, state: e.target.checked };
                      })
                    }
                  />
                </td>
                <td>
                  <button onClick={() => addAnswer()}>Add</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
