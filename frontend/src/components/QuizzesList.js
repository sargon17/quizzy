import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

// utils
import textShortener from "../utils/textShortener";

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
        setQuizzes(response.data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getQuizzes();
  }, []);

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
          <table className="table">
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
                <tr key={quiz.id}>
                  <td>
                    <Link to={`/dashboard/edit-quiz/${quiz.id}`}>
                      <img src={quiz.imagePath} alt="quiz image" />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/dashboard/edit-quiz/${quiz.id}`}>
                      {quiz.title}
                    </Link>
                  </td>
                  <td className="table__description table__row--long">
                    {textShortener(quiz.description, 100)}
                  </td>
                  <td className="table__date">{quiz.subCategory.title}</td>
                  <td className="table__date">{quiz.from}</td>
                  <td>
                    <div className="flex justify-center items-center">
                      <Link
                        to={`/dashboard/edit-quiz/${quiz.id}`}
                        className="btn btn-primary btn-round-s btn-icon btn-icon--sm m-0 mr-2"
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
                      </Link>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="btn btn-error btn-round-s btn-icon btn-icon--sm m-0"
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
