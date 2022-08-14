import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import LoadImage from "./loadImage";

export default function CreateCategory() {
  const [data, setData] = useState({
    title: "",
  });
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);

  const createCategory = () => {
    const formData = new FormData();
    formData.append("title", data.title);
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategories = () => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        setCategories(response.data.categories);
        // console.log(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <h3>Create Category</h3>
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
      <label htmlFor="image">Image</label>
      {/* <FilePond
        onupdatefiles={setImage}
        allowImageResize
        imageResizeTargetWidth={640}
      /> */}
      <LoadImage setImage={setImage} />
      <button onClick={createCategory}>Create</button>
      <ul>
        {categories &&
          categories.map((category) => (
            <li key={category._id}>
              {category.title}
              <img src={category.image} width="300" />
            </li>
          ))}
      </ul>
    </div>
  );
}
