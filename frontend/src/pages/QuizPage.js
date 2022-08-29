import React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Link } from "react-router-dom";

import axios from "axios";

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
        calcPercentage(response.data.correctAnswers);
        setShowResults(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const calcPercentage = (correctAnswersNumber) => {
    setCorrectPercentage(
      Math.round((correctAnswersNumber / questions.length) * 100)
    );
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
                              currentAnswer === index
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
