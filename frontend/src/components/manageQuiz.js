import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { Link, useParams } from "react-router-dom";

import LoadImage from "./loadImage";
import AddCategory from "./AddCategory";
import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

import useOnclickOutside from "react-cool-onclickoutside";

export default function ManageQuiz({ isNewQuiz }) {
  const user = useSelector(userDataSelector);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({
    title: "Quiz by " + user.userName,
    category: {},
    subCategory: {},
    creatorID: user._id,
    description: "",
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const [image, setImage] = useState("");

  const [isImageOnLoad, setIsImageOnLoad] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [question, setQuestion] = useState({});

  const [isAddImage, setIsAddImage] = useState(false);
  const [questionImage, setQuestionImage] = useState("");

  const { quizID } = useParams();
  console.log(quizID);

  const getQuiz = () => {
    axios
      .get(`http://localhost:5000/api/quiz/${quizID}`)
      .then((response) => {
        console.log(response.data);
        setData((prevState) => ({
          ...prevState,
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          subCategory: response.data.subCategory,
          category: response.data.subCategory.category,
          creatorID: response.data.creator._id,
        }));
        setImage(response.data.imagePath);
        setIsLoaded(true);
        getQuestions();
        setIsImageOnLoad(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (!isNewQuiz && quizID) {
      getQuiz();
    }
    setData((prevState) => ({
      ...prevState,
      title: "Quiz by " + user.userName,
      category: {},
      subCategory: {},
      creatorID: user._id,
      description: "",
    }));
  }, []);
  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      title: "Quiz by " + user.userName,
      category: {},
      subCategory: {},
      creatorID: user._id,
      description: "",
    }));
  }, [isNewQuiz]);

  // // state of title input
  const [isTitleInput, setIsTitleInput] = useState(false);
  const titleRef = useOnclickOutside(() => {
    setIsTitleInput(false);
  });

  // state of description input
  const [isDescriptionInput, setIsDescriptionInput] = useState(false);
  const descriptionRef = useOnclickOutside(() => {
    setIsDescriptionInput(false);
  });

  // display add category form
  const [isAddCategory, setIsAddCategory] = useState(false);

  const setCategoryAndSubCategory = (category, subCategory) => {
    setData({ ...data, category, subCategory });
    setIsDataUpdated(true);
  };

  // const [categories, setCategories] = useState([]);
  // const [subCategories, setSubCategories] = useState([]);
  // const [quizzes, setQuizzes] = useState([]);

  const createQuiz = () => {
    console.log(`User ${user._id} is creating a quiz`);
    console.log(user);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryID", data.category.id);
    formData.append("subCategoryID", data.subCategory.id);
    formData.append("creatorID", data.creatorID);
    formData.append("description", data.description);
    formData.append("image", image[0].file);

    axios
      .post("http://localhost:5000/api/quiz/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      .then((response) => {
        console.log(`Quiz created successfully -- ${response.data}`);

        window.location.href = "/dashboard/edit-quiz/" + response.data._id;
        // /dashboard/edit-quiz/630dcbc4fa0ca2daefac1a36
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateQuiz = () => {
    console.log(`User ${user._id} is updating a quiz`);
    console.log(user);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryID", data.category.id || data.category._id);
    formData.append(
      "subCategoryID",
      data.subCategory.id || data.subCategory._id
    );
    formData.append("creatorID", data.creatorID);
    formData.append("description", data.description);
    formData.append("image", image[0].file);

    axios
      .put(`http://localhost:5000/api/quiz/${data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      .then((response) => {
        // console.log(`Quiz updated successfully -- ${response.data}`);
        setIsDataUpdated(false);
        getQuiz();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getQuestions = () => {
    axios
      .get(`http://localhost:5000/api/qa/${quizID}`)
      .then((response) => {
        console.log(response.data);
        setQuestions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadQuestion = () => {
    const formData = new FormData();
    formData.append("text", question.text);
    if (questionImage) {
      formData.append("image", questionImage[0].file);
    }
    formData.append("quizID", data.id);

    axios
      .post(`http://localhost:5000/api/qa/${data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      .then((response) => {
        console.log(`Question created successfully -- ${response.data}`);
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        setIsAddQuestion(false);
        setQuestion({});
        setQuestionImage("");
        getQuiz();
      });
  };

  const deleteQuestion = (questionID) => {
    axios
      .delete(`http://localhost:5000/api/qa/${questionID}`)
      .then((response) => {
        console.log(response.data);
        getQuiz();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="create-quiz">
      <div className="quiz-data grid grid-cols-4 grid-rows-1 gap-5">
        <div className="quiz-cover col-span-1 col-start-1 ">
          {isNewQuiz ? (
            <LoadImage
              setImage={setImage}
              onChange={() => {
                setIsDataUpdated(true);
              }}
            />
          ) : (
            <div className="image-upload relative">
              {!isLoaded && (
                <div className="loading">
                  <div className="pulsate"></div>
                </div>
              )}
              {isLoaded && !isImageOnLoad && (
                <img
                  src={image}
                  alt="quiz cover"
                  onDoubleClick={() => {
                    setIsImageOnLoad(true);
                  }}
                />
              )}
              {isLoaded && isImageOnLoad && (
                <LoadImage
                  setImage={setImage}
                  onChange={() => {
                    setIsDataUpdated(true);
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div className="quiz-content col-span-3 col-start-2 flex flex-col h-full">
          <div className="quiz-title--wrapper">
            {isTitleInput ? (
              <input
                className="input"
                type="text"
                id="title"
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, title: e.target.value };
                  });
                  setIsDataUpdated(true);
                  // console.log(data.title, oldData.title);
                }}
                onKeyUpCapture={(e) => {
                  if (e.key === "Enter") {
                    setIsTitleInput(false);
                  }
                }}
                value={data.title}
                ref={titleRef}
              />
            ) : (
              <>
                <h3
                  className="quiz-title"
                  onDoubleClick={() => setIsTitleInput(true)}
                >
                  {data.title ? data.title : `Quiz by ${user.userName}`}
                </h3>
              </>
            )}
          </div>
          <div className="quiz-category" onClick={() => setIsAddCategory(true)}>
            {!data.category.title && !data.subCategory.title ? (
              <p>+ Add Category</p>
            ) : (
              <p>
                {data.category.title}/{data.subCategory.title}
              </p>
            )}
          </div>
          {isAddCategory && (
            <div className="add-category--wrapper">
              <AddCategory
                setData={setCategoryAndSubCategory}
                open={setIsAddCategory}
                category={data.category}
                subCategory={data.subCategory}
              />
            </div>
          )}
          <div className="quiz-description--wrapper grow">
            {isDescriptionInput ? (
              <textarea
                rows="4"
                className="input input--description"
                type="text"
                id="description"
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, description: e.target.value };
                  });
                  setIsDataUpdated(true);
                }}
                onKeyUpCapture={(e) => {
                  if (e.key === "Enter") {
                    setIsDescriptionInput(false);
                  }
                }}
                ref={descriptionRef}
              >
                {data.description}
              </textarea>
            ) : (
              <p
                className="quiz-description"
                onDoubleClick={() => setIsDescriptionInput(true)}
              >
                {data.description
                  ? data.description
                  : "This is a description of this New Quiz, to change it simply double click on it, in the same way you can change the quiz name"}
              </p>
            )}
          </div>
          <div className="quiz-content__footer flex justify-between w-full">
            <div>Add Special Rules</div>
            <div>
              <button
                className="btn btn-primary btn-primary--shadow btn-sm btn-round-s m-0"
                onClick={() => {
                  if (isDataUpdated) {
                    if (isNewQuiz) {
                      createQuiz();
                    } else {
                      updateQuiz();
                    }
                  }
                }}
                disabled={isDataUpdated ? false : true}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <div className="dashboard-tiles">
          <div className="tile w-full">
            <div className="tile__header">
              <h3 className="tile__title">Questions</h3>
              <div className="tile__actions">
                <button
                  className="btn btn-primary btn-sm btn-round-s m-0"
                  onClick={() => {
                    setIsAddQuestion((prev) => !prev);
                  }}
                >
                  + ADD QUESTION
                </button>
              </div>
            </div>
            <div className="tile__body">
              <table className="tile__table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Question</th>
                    <th>Image</th>
                    <th>Answers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="h-full">
                  {questions.map((question, index) => {
                    return (
                      <tr key={question.id}>
                        <td>{index + 1}</td>
                        <td className="table__row--long table__description">
                          {question.text}
                        </td>
                        <td>
                          {question.image && question.imageType ? (
                            <div className="badge badge--icon badge-success badge-circle">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-check-lg"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="badge badge--icon badge-neutral badge-circle">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td>answers go here</td>
                        <td>
                          <div className="flex justify-start items-center">
                            <Link
                              to={``}
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
                              onClick={() => deleteQuestion(question.id)}
                              className="btn btn-error btn-sm btn-round-s btn-icon m-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-trash3-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {isAddQuestion && (
                    <tr>
                      <td className="table__description">New Question</td>
                      <td>
                        <textarea
                          className="textarea textarea--primary"
                          type="text"
                          id="question"
                          onChange={(e) =>
                            setQuestion((prev) => {
                              return { ...prev, text: e.target.value };
                            })
                          }
                        ></textarea>
                      </td>
                      <td>
                        {!isAddImage && (
                          <button
                            className="btn btn-primary btn-primary-outlined btn-primary--shadow btn-icon btn-sm btn-round-s m-0"
                            onClick={() => setIsAddImage(true)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-file-earmark-arrow-up"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707V11.5z" />
                              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                            </svg>
                          </button>
                        )}
                        {isAddImage && (
                          <LoadImage setImage={setQuestionImage} />
                        )}
                      </td>
                      <td>0</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm btn-round-s m-0"
                          onClick={() => {
                            setQuestions([...questions, question]);
                            setIsAddQuestion(false);
                            uploadQuestion();
                          }}
                        >
                          ADD
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
