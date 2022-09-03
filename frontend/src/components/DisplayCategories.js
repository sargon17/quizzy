import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import GridCards from "../components/GridCards";

import "../scss/style.scss";

export default function DisplayCategories() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        setCategories(response.data);
        setIsLoaded(true);
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
      <GridCards Data={categories} linkPath="/category/" />
      {!isLoaded && (
        <div className="loading">
          <div className="pulsate"></div>
        </div>
      )}
    </div>
  );
}
