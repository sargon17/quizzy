import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

export default function QuizzesList() {
  // user data
  const user = useSelector(userDataSelector);

  const [isLoaded, setIsLoaded] = useState(false);

  // quizzes data
  const [quizzes, setQuizzes] = useState([]);

  const getQuizzes = () => {
    axios
      .get(`http://localhost:5000/api/quiz/all/${user._id}`)
      .then((response) => {
        setQuizzes(response.data.quizzes);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getQuizzes();
  }, []);

  //   utils
  const textShortener = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    } else {
      return text;
    }
  };

  const deleteQuiz = (id) => {
    setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
    axios
      .delete(`http://localhost:5000/api/quiz/${id}/${user._id}`)
      .then((response) => {
        getQuizzes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 mr-5 h-screen dashboard-tiles">
      <div className="tile relative">
        <div className="tile__header">
          <h3 className="tile__title">Quizzes</h3>
          <Link
            to="/dashboard/create-quiz"
            className="btn btn-primary btn-sm btn-round-s m-0"
          >
            Create Quiz
          </Link>
        </div>
        <div className="tile__body">
          <table className="tile__table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th className="table__row--long">Description</th>
                <th>Argument</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td>
                    <img src={quiz.imagePath} alt="quiz image" />
                  </td>
                  <td>{quiz.title}</td>
                  <td className="table__description table__row--long">
                    {textShortener(quiz.description, 100)}
                  </td>
                  <td className="table__date">{quiz.subCategory.title}</td>
                  <td className="table__date">{quiz.createdAt}</td>
                  <td>
                    <div className="flex justify-center items-center">
                      <Link
                        to={`/dashboard/edit-quiz/${quiz.id}`}
                        className="btn btn-primary btn-sm btn-round-s btn-icon m-0 mr-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pencil-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="btn btn-error btn-sm btn-round-s btn-icon m-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-file-earmark-x"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z" />
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoaded && (
          <div className="loading">
            <div className="pulsate"></div>
          </div>
        )}
      </div>
    </div>
  );
}
