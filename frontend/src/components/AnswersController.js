import React from "react";
import { useState, useEffect } from "react";

import axios from "axios";
import useOnclickOutside from "react-cool-onclickoutside";

export default function AnswersController({ questionData }) {
  const { data: quiz, question } = questionData;

  const [answers, setAnswers] = useState([]);
  useEffect(() => {
    setAnswers(question.answers);
    getAnswers();
  }, []);

  const [isNewAnswer, setIsNewAnswer] = useState(false);

  const newAnswerRef = useOnclickOutside(() => {
    setIsNewAnswer(false);
  });

  const [newAnswer, setNewAnswer] = useState({
    question: question.id,
    text: "",
    state: false,
  });

  const getAnswers = () => {
    axios
      .get(`http://localhost:5000/api/qa/answers/${question.id}`)
      .then((response) => {
        setAnswers(response.data.answers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadNewAnswer = () => {
    console.log(newAnswer);
    axios
      .post("http://localhost:5000/api/qa/answers", newAnswer)
      .then((response) => {
        setIsNewAnswer(false);
        setNewAnswer({
          question: question.id,
          text: "",
          state: false,
        });
        getAnswers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="answers-controller">
      <div className="answers-controller__header">
        {question.imagePath && question.imageType && (
          <div className="cover--wrapper">
            <img className="cover" src={question.imagePath} alt={quiz.title} />
          </div>
        )}
        <div className="title--wrapper">
          <h2 className="title">{quiz.title}</h2>
          <h3 className="text">{question.text}</h3>
        </div>
      </div>
      <div className="answers-controller__body">
        <table className="table">
          <thead>
            <tr>
              <th>N</th>
              <th>Answer</th>
              <th>Correct</th>
              <th className="w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer, index) => (
              <tr key={answer.id}>
                <td>{index + 1}</td>
                <td className="table__description">{answer.text}</td>
                <td>{answer.state ? "Yes" : "No"}</td>
                <td className="flex justify-start items-center">
                  <button
                    // onClick={() => deleteQuestion(question.id)}
                    className="btn btn-primary btn-round-s btn-icon btn-icon--sm m-0 mr-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>
                  <button
                    // onClick={() => deleteQuestion(question.id)}
                    className="btn btn-error btn-round-s btn-icon btn-icon--sm m-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}

            {isNewAnswer && (
              <tr ref={newAnswerRef}>
                <td>{answers.length + 1}</td>
                <td>
                  <textarea
                    className="textarea"
                    type="text"
                    id="answer-text"
                    onChange={(e) => {
                      setNewAnswer({ ...newAnswer, text: e.target.value });
                    }}
                    placeholder="Answer text"
                  >
                    {newAnswer.text}
                  </textarea>
                </td>
                <td>
                  <input
                    className="input"
                    type="checkbox"
                    id="answer-correct"
                    onChange={(e) => {
                      setNewAnswer({ ...newAnswer, state: e.target.checked });
                    }}
                    checked={newAnswer.state}
                  />
                </td>
                <td className="w-20 ">
                  <button
                    className="btn btn-primary btn-primary--shadow btn-sm btn-round-s m-0"
                    onClick={uploadNewAnswer}
                  >
                    {" "}
                    SAVE
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!isNewAnswer && (
          <p
            className="add-answer"
            onClick={() => {
              setIsNewAnswer((prev) => !prev);
            }}
          >
            Add Answer
          </p>
        )}
      </div>
    </div>
  );
}
