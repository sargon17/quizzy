import React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Link } from "react-router-dom";

import axios from "axios";
import { getUser } from "gh-pages/lib/util";

export default function QuizPage() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [correctPercentage, setCorrectPercentage] = useState("");

  const { quizID } = useParams();

  useEffect(() => {
    getQuiz();
    getQuestions();
  }, []);

  useEffect(() => {
    questions.forEach((question) => {
      question.answers.sort((a, b) => 0.5 - Math.random());
    });
  }, [questions]);

  useEffect(() => {
    if (answers.length > 0) {
      setCurrentAnswer(
        answers.find(
          (answer) => answer.question === questions[activeQuestion].id
        ).response || ""
      );
    }
  }, [activeQuestion, answers]);

  const getQuiz = () => {
    axios
      .get(`http://localhost:5000/api/quiz/${quizID}`)
      .then((response) => {
        setQuiz(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getQuestions = () => {
    axios
      .get(`http://localhost:5000/api/qa/${quizID}`)
      .then((response) => {
        setQuestions(response.data);
        console.log(response.data);
        response.data.forEach((question) => {
          setAnswers((prevState) => [
            ...prevState,
            { question: question.id, response: "" },
          ]);
        });
        console.log("answers", answers);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const sendResults = () => {
    console.log("answers", answers);
    axios
      .post(`http://localhost:5000/api/qa/answers/control`, {
        answers,
      })
      .then((response) => {
        console.log(response.data);
        calcStats(response.data.correctAnswers);
        setShowResults(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveQuizStats = (score) => {
    axios
      .put(`http://localhost:5000/api/quiz/stats/${quizID}`, {
        score,
      })
      .then((response) => {
        if (response.status !== 200) {
          console.log("Error saving quiz stats");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const calcStats = (correctAnswersNumber) => {
    const percentage = Math.round(
      (correctAnswersNumber / questions.length) * 100
    );
    setCorrectPercentage(percentage);
    saveQuizStats(percentage);
  };

  const [userLiked, setUserLiked] = useState(false);

  // useEffect(() => {
  //   handleLike();
  // }, [userLiked]);

  const handleLike = () => {
    axios
      .put(`http://localhost:5000/api/quiz/like/${quizID}`, {
        user: cookies.user._id || null,
        like: true,
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="container mx-auto relative h-screen">
      {quiz.title && questions[activeQuestion] && (
        <div>
          <div className="question-card">
            {!showResults ? (
              <>
                <div className="question-card__header">
                  <div className="question-card__header__content">
                    <h1 className="question-card__title">{quiz.title}</h1>
                    <h3 className="question-card__author">
                      By: {quiz.creator.userName}
                    </h3>
                  </div>
                  <div>
                    {cookies.user &&
                      cookies.user.userName === quiz.creator.userName && (
                        <Link
                          to={`/dashboard/edit-quiz/${quiz.id}`}
                          className="btn btn-primary-outlined btn-xs btn-round-s"
                        >
                          Edit
                        </Link>
                      )}
                    {/* http://localhost:3000/quiz-controller/62fcec771efc12754bb2f671 */}
                  </div>
                </div>
                <div className="question-card__progress-bar">
                  {questions.map((question, index) => (
                    <div
                      className={`question-card__progress-bar__item ${
                        index === activeQuestion
                          ? "question-card__progress-bar__item--active"
                          : (index < activeQuestion &&
                              "question-card__progress-bar__item--completed") ||
                            ""
                      }`}
                      key={question.id}
                    ></div>
                  ))}
                </div>
                <div className="question-card__body">
                  <div className="question-card__question-wrapper">
                    <div className="question-card__question__image-wrapper">
                      {questions[activeQuestion].image &&
                        questions[activeQuestion].imageType && (
                          <img
                            src={questions[activeQuestion].imagePath}
                            width="300"
                          />
                        )}
                    </div>
                    <h2>{questions[activeQuestion].text}</h2>
                  </div>
                  <div className="question-card__answers">
                    <ul>
                      {questions[activeQuestion].answers.map(
                        (answer, index) => (
                          <li
                            key={answer._id}
                            className={
                              currentAnswer === answer._id
                                ? "question-card__answer question-card__answer-selected"
                                : "question-card__answer"
                            }
                            onClick={() => {
                              setAnswers((prevState) => {
                                return prevState.map((a) => {
                                  if (
                                    a.question == questions[activeQuestion].id
                                  ) {
                                    return { ...a, response: answer._id };
                                  } else {
                                    return a;
                                  }
                                });
                              });
                              setCurrentAnswer(index);
                              // console.log(answers);
                            }}
                          >
                            <input
                              type="radio"
                              name={questions[activeQuestion].id}
                              id={answer._id}
                            />
                            <label htmlFor={answer._id}>{answer.text}</label>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="question-card__footer">
                  {activeQuestion < questions.length - 1 ? (
                    <>
                      {activeQuestion > 0 && (
                        <button
                          className="btn btn-secondary-outlined btn-secondary--shadow btn-round-s "
                          onClick={() => {
                            setActiveQuestion((prevState) => prevState - 1);
                            setCurrentAnswer("");
                          }}
                        >
                          Previous
                        </button>
                      )}
                      <button
                        className="btn btn-primary btn-round-s btn-primary--shadow ml-auto "
                        onClick={() => {
                          setActiveQuestion((prevState) => prevState + 1);
                          setCurrentAnswer("");
                        }}
                      >
                        Next
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary-outlined btn-secondary--shadow btn-round-s "
                        onClick={() => {
                          setActiveQuestion((prevState) => prevState - 1);
                          setCurrentAnswer("");
                        }}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-primary btn-round-s"
                        onClick={sendResults}
                      >
                        Submit
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="question-card__results">
                <h1>Results</h1>
                <h2>You got {correctPercentage}% correct</h2>
                <div className="flex justify-center items-center gap-5">
                  <p>Did you liked this quiz?</p>
                  <div onClick={handleLike} className="like-btn">
                    {userLiked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-heart-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
