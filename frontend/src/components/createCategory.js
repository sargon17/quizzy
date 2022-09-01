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
                    <td className="flex justify-start items-start gap-5">
                      <button className="btn btn-primary btn-sm btn-round-s m-0">
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-sm btn-round-s m-0"
                        onClick={() => deleteCategory(category._id)}
                      >
                        Delete
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
