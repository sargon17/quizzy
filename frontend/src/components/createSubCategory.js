import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";

registerPlugin(
  //   FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageResize
);

export default function CreateSubCategory() {
  const [data, setData] = useState({
    title: "",
    categoryId: "",
  });
  const [image, setImage] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const createSubCategory = () => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryID", data.categoryID);
    formData.append("image", image[0].file);

    axios
      .post("http://localhost:5000/api/sub_category/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (formData) => formData,
      })
      .then((response) => {
        console.log(response);
        getSubCategories();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSubCategories = () => {
    console.log("getSubCategories: " + data.categoryID);
    axios
      .get(`http://localhost:5000/api/sub_category/${data.categoryID}`)
      .then((response) => {
        setSubCategories(response.data.subCategories);
        console.log(response.data.subCategories);
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
        console.log(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getSubCategories();
  }, [data.categoryID]);

  return (
    <div>
      <h3>Create SubCategory</h3>
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
      <label htmlFor="title">Title</label>
      <select
        id="categoryID"
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

      <label htmlFor="image">Image</label>
      <FilePond
        onupdatefiles={setImage}
        allowImageResize
        imageResizeTargetWidth={640}
      />
      <button onClick={createSubCategory}>Create</button>
      <ul>
        {subCategories &&
          subCategories.map((category) => (
            <li key={category.id}>
              {category.title}
              <p>{category.category}</p>
              <img src={category.image} width="300" />
            </li>
          ))}
      </ul>
    </div>
  );
}
