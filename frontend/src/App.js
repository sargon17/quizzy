import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import checkUserAuth from "./utils/checkUserAuth";

import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizControlPage from "./pages/QuizControlPage";
import SubCategoryPage from "./pages/SubCategoriesPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import "./App.css";
import "react-notifications-component/dist/theme.css";

import Header from "./components/Header";

import DashboardTiles from "./components/DashboardTiles";
import ManageQuiz from "./components/manageQuiz";
import QuizzesList from "./components/QuizzesList";
import CreateCategory from "./components/createCategory";
import CreateSubCategory from "./components/createSubCategory";

import { useSelector, useDispatch } from "react-redux";
import { setUserData, userDataSelector } from "./features/user/userDataSlice";

import { ReactNotifications } from "react-notifications-component";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userData, setUserData] = useState({ userName: "", email: "" });

  const user = useSelector(userDataSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (checkUserAuth(cookies)) {
        setIsAuthenticated(true);
        // setUserData({
        //   userName: cookies.user.userName,
        //   email: cookies.user.email,
        // });
        dispatch(
          setUserData({
            userName: cookies.user.userName,
            email: cookies.user.email,
            _id: cookies.user._id,
          })
        );
      }
    }
  }, []);

  const logout = () => {
    removeCookie("user", { path: "/" });
    removeCookie("accessToken", { path: "/" });
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="App">
        <ReactNotifications />
        <Routes>
          {/* Front Office */}
          <Route
            path="/"
            element={
              <>
                <Header logout={logout} isAuthenticated={isAuthenticated} />
                <Homepage />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header logout={logout} isAuthenticated={isAuthenticated} />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Header logout={logout} isAuthenticated={isAuthenticated} />
                <Register />
              </>
            }
          />
          <Route
            path="/category/:categoryID"
            element={
              <>
                <Header logout={logout} isAuthenticated={isAuthenticated} />
                <SubCategoryPage />
              </>
            }
          />
          <Route
            path="/sub-category/:subCategoryID"
            element={
              <>
                <Header logout={logout} isAuthenticated={isAuthenticated} />
                <QuizzesPage />
              </>
            }
          />
          <Route
            path="/quiz/:quizID"
            element={
              <>
                <Header logout={logout} isAuthenticated={isAuthenticated} />
                <QuizPage />
              </>
            }
          />
          {/* Front Office */}
          {/* ========================================================================================== */}
          {/* Back Office */}
          {/* Quizzes */}
          <Route
            path="/dashboard/create-quiz"
            element={
              <Dashboard>
                <ManageQuiz isNewQuiz={true} />
              </Dashboard>
            }
          />
          <Route
            path="/dashboard/quizzes"
            element={
              <Dashboard>
                <QuizzesList />
              </Dashboard>
            }
          />
          <Route
            path="/dashboard/edit-quiz/:quizID"
            element={
              <Dashboard>
                <ManageQuiz isNewQuiz={false} />
              </Dashboard>
            }
          />
          {/* Quizzes */}
          <Route
            path="/dashboard"
            element={
              <Dashboard>
                <DashboardTiles />
              </Dashboard>
            }
          />
          <Route
            path="/dashboard/categories"
            element={
              <Dashboard>
                <CreateCategory />
              </Dashboard>
            }
          />
          <Route
            path="/dashboard/sub-categories/:categoryID"
            element={
              <Dashboard>
                <CreateSubCategory />
              </Dashboard>
            }
          />
          {/* <Route
            path="/quiz-controller/:quizID"
            element={<QuizControlPage />}
          /> */}
          {/* Back Office */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
