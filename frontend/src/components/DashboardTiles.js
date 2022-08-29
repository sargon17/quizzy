import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";
import { Link } from "react-router-dom";

// utils
import textShortener from "../utils/textShortener";

export default function DashboardTiles() {
  // user data
  const user = useSelector(userDataSelector);

  // Last quiz created by user
  const [isLastQuizLoaded, setIsLastQuizLoaded] = useState(false);
  const [lastQuiz, setLastQuiz] = useState(null);

  const getLastQuizByUser = () => {
    axios
      .get(`http://localhost:5000/api/quiz/last/${user._id}`)
      .then((response) => {
        if (response.status === 200) {
          setLastQuiz(response.data);
        } else {
          setLastQuiz(null);
        }
        setIsLastQuizLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLastQuizByUser();
  }, [user]);

  return (
    <div className="dashboard-tiles grid grid-cols-4 grid-rows-5 gap-5 mr-5">
      <div className="tile col-span-1 row-span-1 row-start-1"></div>
      <div className="tile col-span-1 row-span-1 row-start-2"></div>
      <div className="tile col-start-2 col-end-4 row-start-1 row-end-3"></div>
      <div className="tile col-span-1 row-start-1 row-span-4"></div>
      {/* ============= Last Quiz Created ================ */}
      <div className="tile col-start-1 col-span-2 row-start-3 row-span-1 relative">
        {isLastQuizLoaded && lastQuiz && (
          <div className="flex justify-between h-full">
            {/* content */}
            <div className="tile__header tile__header--lastQuiz">
              <h4 className="tile__name">Last Created Quiz</h4>
              <h3 className="tile__title tile__text-accent">
                {textShortener(lastQuiz.title, 20)}
              </h3>
              <h4 className="tile__subtitle">
                {lastQuiz.subCategory.category.title}/
                {lastQuiz.subCategory.title}
              </h4>
              <p className="tile__text">
                {textShortener(lastQuiz.description, 100)}
              </p>
              <Link
                to={`/dashboard/edit-quiz/${lastQuiz._id}`}
                className="tile__link"
              >
                Continue Edit
              </Link>
            </div>
            {/* / content */}
            {/* cover */}
            <div className="tile__body--lastQuiz">
              <div className="tile__cover">
                <img
                  src={lastQuiz.imagePath}
                  alt="cover"
                  className="tile__cover__img"
                />
                <div className="coverOverlay"></div>
              </div>
            </div>
            {/* / cover */}
          </div>
        )}
        {isLastQuizLoaded && !lastQuiz && (
          <div className="flex justify-center items-center h-full">
            <div className="tile__header--lastQuiz text-center">
              <h3 className="tile__title">No Quizzes Created Yet</h3>
              <Link
                to="/dashboard/create-quiz"
                className="btn btn-secondary btn-sm btn-round-s btn-secondary--shadow m-0 mt-1"
              >
                Create Now
              </Link>
            </div>
          </div>
        )}
        {!isLastQuizLoaded && (
          <div className="loading">
            <div className="pulsate"></div>
          </div>
        )}
      </div>
      {/* ============= / Last Quiz Created ================ */}
      <div className="tile col-span-1 row-span-1 row-start-3"></div>
      <div className="tile col-span-3 row-span-2 row-start-4"></div>
      <div className="tile col-span-1 row-span-1 row-start-5"></div>
    </div>
  );
}
