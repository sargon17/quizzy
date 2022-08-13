import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";

registerPlugin(
  //   FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageResize
);

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
        console.log(response);
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
        console.log(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  }

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
      <label htmlFor="image">Image</label>
      <FilePond onupdatefiles={setImage} />
      <button onClick={createCategory}>Create</button>
      <ul>
        {categories &&
          categories.map((category) => (
            <li key={category._id}>{category.title}</li>
          ))}
      </ul>
    </div>
  );
}
