import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import useOnclickOutside from "react-cool-onclickoutside";

export default function AddCategory({ setData, open, category, subCategory }) {
  // all categories and subcategories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // input fields
  const [catField, setCatField] = useState("");
  const [subCatField, setSubCatField] = useState("");

  // selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // const [isTitleInput, setIsTitleInput] = useState(false);
  // const titleRef = useOnclickOutside(() => {
  //   setIsTitleInput(false);
  // });

  const cardRef = useOnclickOutside(() => {
    open(false);
  });

  // download all categories from database or by name
  const getCategories = () => {
    axios
      .get(
        catField
          ? `http://localhost:5000/api/category/title/${catField}`
          : `http://localhost:5000/api/category`
      )
      .then((response) => {
        setCategories(response.data);
        // console.log(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCategories();
    if (category) {
      setSelectedCategory(category);
    }
    if (subCategory) {
      setSelectedSubCategory(subCategory);
    }
  }, []);

  // download subcategories from database by category id and by name
  const getSubCategories = (id) => {
    axios
      .get(
        subCatField
          ? `http://localhost:5000/api/sub_category/title/${subCatField}/${id}`
          : `http://localhost:5000/api/sub_category/${id}`
      )
      .then((response) => {
        setSubCategories(response.data);
        // console.log(response.data.subCategories);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // search for categories when user types in the search field
  useEffect(() => {
    getCategories();
  }, [catField]);

  useEffect(() => {
    if (selectedCategory) {
      getSubCategories(selectedCategory.id);
    }
  }, [selectedCategory]);

  return (
    <div className="add-category" ref={cardRef}>
      <div className="add-category__title--wrapper">
        <h2 className="add-category__title">Add Category</h2>
        <h3 className="add-category__selected">
          {selectedCategory ? selectedCategory.title : ""}
          {selectedSubCategory ? `/${selectedSubCategory.title}` : ""}
        </h3>
      </div>
      <div className="add-category__body">
        <input
          className="input"
          type="text"
          id="category-name"
          onChange={(e) => {
            setCatField(e.target.value);
          }}
          value={catField}
          placeholder="Search for category"
        />
        <div className="mini-card-scroll">
          {categories.map((category) => (
            <div
              className={
                selectedCategory && selectedCategory.id === category.id
                  ? "mini-card mini-card--selected"
                  : "mini-card"
              }
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);
                setSubCatField("");
                setSubCategories([]);
                setSelectedSubCategory(null);
              }}
            >
              <div className="mini-card-image">
                <img src={category.imagePath} alt={category.title} />
              </div>
              <div className="mini-card-title">
                <h3 className="title">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <input
          className="input"
          type="text"
          id="subCategory-name"
          onChange={(e) => {
            setSubCatField(e.target.value);
          }}
          value={subCatField}
          placeholder={
            !selectedCategory
              ? "Select a category first"
              : "Search for subcategory"
          }
          disabled={!selectedCategory}
        />
        {selectedCategory && (
          <>
            <div className="mini-card-scroll">
              {subCategories.map((category) => (
                <div
                  className={
                    selectedSubCategory &&
                    selectedSubCategory.id === category.id
                      ? "mini-card mini-card--selected"
                      : "mini-card"
                  }
                  key={category.id}
                  onClick={() => setSelectedSubCategory(category)}
                >
                  <div className="mini-card-image">
                    <img src={category.imagePath} alt={category.title} />
                  </div>
                  <div className="mini-card-title">
                    <h3 className="title">{category.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="add-category__footer">
        <button
          className="btn btn-primary btn-sm btn-primary--shadow btn-round-s"
          onClick={() => {
            setData(selectedCategory, selectedSubCategory);
            open(false);
          }}
          disabled={!selectedCategory || !selectedSubCategory}
        >
          SAVE
        </button>
      </div>
    </div>
  );
}
