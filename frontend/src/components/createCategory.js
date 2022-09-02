import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import LoadImage from "./loadImage";
import { Store } from "react-notifications-component";

export default function CreateCategory() {
  const [isLoaded, setIsLoaded] = useState(false);

  // new category states and data
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const [image, setImage] = useState("");
  const [newCategory, setNewCategory] = useState({});

  const [categories, setCategories] = useState([]);

  const createCategory = () => {
    const formData = new FormData();
    formData.append("title", newCategory.title);
    formData.append("image", image[0].file);

    axios
      .post("http://localhost:5000/api/category/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      .then((response) => {
        // console.log(response);
        getCategories();
        setImage("");
        setNewCategory({});
        setIsCreateCategory(false);
        Store.addNotification({
          title: "Success",
          message: "Category created successfully",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCategory = (id) => {
    axios
      .delete(`http://localhost:5000/api/category/delete/${id}`)
      .then((response) => {
        getCategories();
        Store.addNotification({
          title: "Success",
          message: "Category deleted successfully",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategories = () => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        setCategories(response.data);
        setIsLoaded(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 grid-rows-1 mr-5 h-screen dashboard-tiles">
      <div className="tile relative">
        <div className="tile__header">
          <h3 className="tile__title">All Categories</h3>
          <button
            className="btn btn-primary btn-sm btn-round-s m-0"
            onClick={() => setIsCreateCategory((prev) => !prev)}
          >
            Create New Category
          </button>
        </div>
        <div className="tile__body">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Arguments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <Link to={`/dashboard/sub-categories/${category._id}`}>
                        <img src={category.imagePath} alt="" />
                      </Link>
                    </td>
                    <td>
                      <Link to={`/dashboard/sub-categories/${category._id}`}>
                        {category.title}
                      </Link>
                    </td>
                    <td>{category.subCategories.length}</td>
                    <td className="flex justify-start items-center gap-2 h-full">
                      <button className="btn btn-primary btn-round-s btn-icon btn-icon--sm m-0">
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
                        onClick={() => deleteCategory(category._id)}
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
              {isCreateCategory && (
                <tr>
                  <td>
                    <LoadImage setImage={setImage} />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input"
                      placeholder="Category Title"
                      value={newCategory.title}
                      onChange={(event) =>
                        setNewCategory({
                          ...newCategory,
                          title: event.target.value,
                        })
                      }
                    />
                  </td>
                  <td></td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm btn-round-s m-0"
                      onClick={() => {
                        createCategory();
                        setIsCreateCategory(false);
                      }}
                    >
                      Create
                    </button>
                  </td>
                </tr>
              )}
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
