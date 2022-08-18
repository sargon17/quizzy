import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";

import GridCards from "../components/GridCards";

export default function CategoryPage() {
  const [subCategories, setSubCategories] = useState([]);

  const { categoryID } = useParams();

  const getSubCategories = () => {
    axios
      .get(`http://localhost:5000/api/sub_category/${categoryID}`)
      .then((response) => {
        setSubCategories(response.data.subCategories);
        console.log(response.data.subCategories);
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
      <button className="btn btn-primary">Get Categories</button>
    </div>
  );
}
