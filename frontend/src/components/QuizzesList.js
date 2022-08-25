import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

export default function QuizzesList() {
  // user data
  const user = useSelector(userDataSelector);

  // quizzes data
  const [quizzes, setQuizzes] = useState([]);

  const getQuizzes = () => {
    axios
      .get(`http://localhost:5000/api/quiz/all/${user._id}`)
      .then((response) => {
        setQuizzes(response.data.quizzes);

        console.log(response.data.quizzes);
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
      <div className="tile">
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
                    <img src={quiz.image} alt="quiz image" />
                  </td>
                  <td>{quiz.title}</td>
                  <td className="table__description table__row--long">
                    {textShortener(quiz.description, 100)}
                  </td>
                  <td className="table__date">{quiz.subCategory.title}</td>
                  <td className="table__date">{quiz.createdAt}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit-quiz/${quiz.id}`}
                      className="btn btn-primary btn-sm btn-round-s m-0 mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="btn btn-error btn-sm btn-round-s m-0"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
