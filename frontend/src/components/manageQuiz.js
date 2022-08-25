import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { Link, useParams } from "react-router-dom";

import LoadImage from "./loadImage";
import AddCategory from "./AddCategory";
import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

import useOnclickOutside from "react-cool-onclickoutside";

export default function ManageQuiz({ isNewQuiz }) {
  const user = useSelector(userDataSelector);
  const [data, setData] = useState({
    title: "Quiz by " + user.userName,
    category: {},
    subCategory: {},
    creatorID: user._id,
    description: "",
  });
  const [image, setImage] = useState("");

  useEffect(() => {
    console.log();
  }, [image]);

  const { quizID } = useParams();
  console.log(quizID);

  const getQuiz = () => {
    axios
      .get(`http://localhost:5000/api/quiz/${quizID}`)
      .then((response) => {
        console.log(response.data);
        setData((prevState) => ({
          ...prevState,
          id: response.data.quiz.id,
          title: response.data.quiz.title,
          description: response.data.quiz.description,
          subCategory: response.data.quiz.subCategory,
          category: response.data.quiz.subCategory.category,
          creatorID: response.data.quiz.creator._id,
        }));
        setImage(response.data.quiz.image);
        console.log(response.data.quiz);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (!isNewQuiz && quizID) {
      getQuiz();
    }
  }, []);

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const getQuizzes = () => {
  //   axios
  //     .get(`http://localhost:5000/api/quiz/all/${userID}`)
  //     .then((response) => {
  //       setQuizzes(response.data.quizzes);

  //       console.log(response.data.quizzes);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const getCategories = () => {
  //   axios
  //     .get("http://localhost:5000/api/category")
  //     .then((response) => {
  //       setData({ ...data, categoryID: response.data.categories[0].id });
  //       console.log(data);
  //       setCategories(response.data.categories);
  //       console.log(response.data.categories);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // const getSubCategories = () => {
  //   axios
  //     .get(`http://localhost:5000/api/sub_category/${data.categoryID}`)
  //     .then((response) => {
  //       setSubCategories(response.data.subCategories);
  //       setData({ ...data, subCategoryID: response.data.subCategories[0].id });
  //       // console.log(response.data.subCategories);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   getCategories();
  //   getSubCategories();
  //   getQuizzes();
  // }, []);

  // useEffect(() => {
  //   getSubCategories();
  // }, [data.categoryID]);

  return (
    <div className="create-quiz">
      <div className="quiz-data grid grid-cols-4 grid-rows-1 gap-5 h-96">
        <div className="quiz-cover col-span-1 col-start-1 ">
          {isNewQuiz ? (
            <LoadImage setImage={setImage} />
          ) : (
            <div className="image-upload">
              <img src={image} alt="quiz cover" />
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
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
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
                onChange={(e) =>
                  setData((prev) => {
                    return { ...prev, description: e.target.value };
                  })
                }
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
                onClick={createQuiz}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================== */}
      {/* ========================================================================== */}
      {/* ========================================================================== */}
      {/* ========================================================================== */}
      {/* <h3>Create Quiz</h3>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        onChange={(e) =>
          setData((prev) => {
            return { ...prev, title: e.target.value };
          })
        }
      />
      <br />
      <label htmlFor="categoryID">Category</label>
      <select
        id="CategoryID"
        onChange={(e) =>
          setData((prev) => {
            return { ...prev, categoryID: e.target.value };
          })
        }
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="subCategoryID">SubCategory</label>
      <select
        id="subCategoryID"
        onChange={(e) =>
          setData((prev) => {
            return { ...prev, subCategoryID: e.target.value };
          })
        }
        disabled={subCategories.length === 0}
      >
        {subCategories.map((subCategory) => {
          return (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.title || "No SubCategory"}
            </option>
          );
        })}
      </select>
      <br />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        onChange={(e) =>
          setData((prev) => {
            return { ...prev, description: e.target.value };
          })
        }
      ></textarea>
      <br />
      <LoadImage setImage={setImage} />
      <br />
      <button
        onClick={createQuiz}
        disabled={
          data.title === "" ||
          data.categoryID === "" ||
          data.subCategoryID === "" ||
          data.description === "" ||
          image === ""
        }
      >
        Create
      </button>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>SubCategory</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes &&
            quizzes.map((quiz) => {
              return (
                <tr key={quiz.id}>
                  <td>{quiz.title ? quiz.title : " "}</td>
                  <td>
                    {quiz.subCategory.title ? quiz.subCategory.title : " "}
                  </td>
                  <td>{quiz.description ? quiz.description : " "}</td>
                  <td>
                    <img
                      src={quiz.image ? quiz.image : " "}
                      alt="quiz"
                      width="200"
                    />
                  </td>
                  <td>
                    <Link to={`/quiz-controller/${quiz.id}`}> Edit </Link>
                    <button>Delete</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <button onClick={getQuizzes}>Update</button> */}
    </div>
  );
}
