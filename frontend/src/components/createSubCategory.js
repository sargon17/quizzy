import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import LoadImage from "./loadImage";

export default function CreateSubCategory() {
  const [data, setData] = useState({
    title: "",
    categoryID: "",
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
        // console.log(response);
        getSubCategories();
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
        // console.log(response.data.subCategories);
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
        // console.log(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    getSubCategories();
  }, [data.categoryID]);

  const fetchData = async () => {
    try {
      await getCategories();
      await getSubCategories();
    } catch (err) {
      console.log(err);
    }
  };

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
      <br />
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
          <option
            key={category.id}
            value={category.id}
            selected={data.categoryID === category.id}
          >
            {category.title}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="image">Image</label>
      <LoadImage setImage={setImage} />
      <br />
      <button onClick={createSubCategory}>Create</button>
      <ul>
        {subCategories &&
          subCategories.map((category) => (
            <li key={category.id + category.title}>
              {category.title}
              <p>{category.category.title}</p>
              <img src={category.imagePath} width="300" />
            </li>
          ))}
      </ul>
    </div>
  );
}
