import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import GridCards from "../components/GridCards";

import "../scss/style.scss";

export default function DisplayCategories() {
  const [categories, setCategories] = useState([]);

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
    <div className="container mx-auto">
      <h3 className="text-center text-2xl font-bold p-10">
        Select your category
      </h3>
      <GridCards Data={categories} linkPath="/category/" />
      <button className="btn btn-primary" onClick={getCategories}>
        Get Categories
      </button>
    </div>
  );
}
