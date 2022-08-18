import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import LoadImage from "./loadImage";

export default function CreateQuiz({ userID }) {
  const [data, setData] = useState({
    title: "",
    categoryID: "",
    subCategoryID: "",
    creatorID: userID,
    description: "",
  });
  const [image, setImage] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const createQuiz = () => {
    console.log(`User ${userID} is creating a quiz`);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryID", data.categoryID);
    formData.append("subCategoryID", data.subCategoryID);
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
        getQuizzes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getQuizzes = () => {
    axios
      .get(`http://localhost:5000/api/quiz/all/${userID}`)
      .then((response) => {
        setQuizzes(response.data.quizzes);

        console.log(response.data.quizzes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategories = () => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        setData({ ...data, categoryID: response.data.categories[0].id });
        console.log(data);
        setCategories(response.data.categories);
        console.log(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getSubCategories = () => {
    axios
      .get(`http://localhost:5000/api/sub_category/${data.categoryID}`)
      .then((response) => {
        setSubCategories(response.data.subCategories);
        setData({ ...data, subCategoryID: response.data.subCategories[0].id });
        // console.log(response.data.subCategories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategories();
    getSubCategories();
    getQuizzes();
  }, []);

  useEffect(() => {
    getSubCategories();
  }, [data.categoryID]);

  return (
    <div>
      <h3>Create Quiz</h3>
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
      <button onClick={getQuizzes}>Update</button>
    </div>
  );
}
