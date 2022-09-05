import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import Card from "../components/Card";

export default function QuizzesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const { subCategoryID } = useParams();

  const getQuizzes = () => {
    axios
      .get(`http://localhost:5000/api/quiz/sub-category/${subCategoryID}`)
      .then((response) => {
        setQuizzes(response.data);
        setIsLoaded(true);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getQuizzes();
  }, []);

  return (
    <div className="container mx-auto">
      <h3 className="text-center text-2xl font-bold p-10">
        Select an argument
      </h3>
      <ul className="flex flex-wrap justify-center gap-2 ">
        {quizzes.map((quiz) => (
          <Card
            linkPath="/quiz/"
            overTitle={quiz.creator.userName}
            title={quiz.title}
            subTitle={`${quiz.subCategory.category.title} / ${quiz.subCategory.title}`}
            text={quiz.description}
            id={quiz.id}
            key={quiz.key}
            image={quiz.imagePath}
            linkText="Try Yourself"
            passingRate={quiz.passingRate}
          />
        ))}
      </ul>
      {!isLoaded && (
        <div className="loading">
          <div className="pulsate"></div>
        </div>
      )}
    </div>
  );
}
