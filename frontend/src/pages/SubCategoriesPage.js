import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";

import GridCards from "../components/GridCards";

export default function SubCategoryPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  const { categoryID } = useParams();

  const getSubCategories = () => {
    axios
      .get(`http://localhost:5000/api/sub_category/${categoryID}`)
      .then((response) => {
        setSubCategories(response.data);
        setIsLoaded(true);
        // console.log(response.data.subCategories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSubCategories();
  }, []);

  return (
    <div className="container mx-auto">
      <h3 className="text-center text-2xl font-bold p-10">
        Select an argument
      </h3>
      <GridCards Data={subCategories} linkPath="/sub-category/" />
      {!isLoaded && (
        <div className="loading">
          <div className="pulsate"></div>
        </div>
      )}
      {isLoaded && subCategories.length === 0 && (
        <div className="text-center text-2xl font-bold p-10">
          No arguments found
        </div>
      )}
    </div>
  );
}
