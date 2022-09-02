import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import LoadImage from "./loadImage";

import { Store } from "react-notifications-component";
import useOnclickOutside from "react-cool-onclickoutside";

export default function CreateSubCategory() {
  const { categoryID } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  // const [data, setData] = useState({
  //   title: "",
  //   categoryID: "",
  // });
  const [image, setImage] = useState("");
  const [newSubCategory, setNewSubCategory] = useState({});
  const newSubCategoryRef = useOnclickOutside(() => {
    setIsNewSubCategory(false);
  });

  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState({});

  const [isNewSubCategory, setIsNewSubCategory] = useState(false);

  const createSubCategory = () => {
    const formData = new FormData();
    formData.append("title", newSubCategory.title);
    formData.append("categoryID", categoryID);
    formData.append("image", image[0].file);

    axios
      .post("http://localhost:5000/api/sub_category/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      .then((response) => {
        // console.log(response);
        getSubCategories();
        setIsNewSubCategory(false);
        setNewSubCategory({
          title: "",
        });
        setImage("");

        Store.addNotification({
          title: "Success",
          message: "Argument created successfully",
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

  const getSubCategories = () => {
    axios
      .get(`http://localhost:5000/api/sub_category/${categoryID}`)
      .then((response) => {
        setSubCategories(response.data);
        setIsLoaded(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const getCategories = () => {
  //   axios
  //     .get("http://localhost:5000/api/category")
  //     .then((response) => {
  //       setData({ ...data, categoryID: response.data.categories[0].id });
  //       console.log(data);
  //       setCategories(response.data.categories);
  //       // console.log(response.data.categories);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getCategory = () => {
    axios
      .get(`http://localhost:5000/api/category/id/${categoryID}`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [categoryID]);

  const fetchData = async () => {
    try {
      await getSubCategories();
      await getCategory();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 mr-5 h-screen dashboard-tiles">
      <div className="tile relative">
        <div className="tile__header">
          <h3 className="tile__title">{category.title} Arguments</h3>
          <button
            className="btn btn-primary btn-sm btn-round-s m-0"
            onClick={() => setIsNewSubCategory((prev) => !prev)}
          >
            Create New Argument
          </button>
        </div>
        <div className="tile__body">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Quizzes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories &&
                subCategories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      {/* <Link to={`/dashboard/sub-categories/${category._id}`}> */}
                      <img src={category.imagePath} alt="" />
                      {/* </Link> */}
                    </td>
                    <td>
                      {/* <Link to={`/dashboard/sub-categories/${category._id}`}> */}
                      {category.title}
                      {/* </Link> */}
                    </td>
                    <td>{category.quizzes.length}</td>
                    <td className="flex justify-start items-start gap-5">
                      <button className="btn btn-primary btn-sm btn-round-s m-0">
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-sm btn-round-s m-0"
                        // onClick={() => deleteCategory(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              {isNewSubCategory && (
                <tr ref={newSubCategoryRef}>
                  <td>
                    <LoadImage setImage={setImage} />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input"
                      placeholder="Argument Title"
                      value={newSubCategory.title}
                      onChange={(event) =>
                        setNewSubCategory({
                          ...newSubCategory,
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
                        createSubCategory();
                        setIsNewSubCategory(false);
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
