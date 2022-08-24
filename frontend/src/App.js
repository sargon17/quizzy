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

import DashboardTiles from "./components/DashboardTiles";
import CreateQuiz from "./components/createQuiz";

import { useSelector, useDispatch } from "react-redux";
import { setUserData, userDataSelector } from "./features/user/userDataSlice";

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
        <header className="App-header">
          <nav className="flex justify-center">
            <ul className="flex justify-center">
              <li>
                <Link
                  to="/"
                  className="p-4 transition-all duration-300 hover:text-blue-500"
                >
                  Home
                </Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="p-4 transition-all duration-300 hover:text-blue-500"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="p-4 transition-all duration-300 hover:text-blue-500"
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <p>Welcome {user.userName}</p>
                  <li>
                    <Link
                      to={`/dashboard/${user.userName}`}
                      className="p-4 transition-all duration-300 hover:text-blue-500"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="m-0 btn btn-secondary btn-xs btn-round-s "
                      onClick={logout}
                    >
                      Logout
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/create-quiz"
            element={
              <Dashboard>
                <CreateQuiz />
              </Dashboard>
            }
          />
          <Route
            path="/dashboard/:userName"
            element={
              <Dashboard>
                <DashboardTiles />
              </Dashboard>
            }
          />
          <Route path="/category/:categoryID" element={<SubCategoryPage />} />
          <Route
            path="/sub-category/:subCategoryID"
            element={<QuizzesPage />}
          />
          <Route path="/quiz/:quizID" element={<QuizPage />} />
          <Route
            path="/quiz-controller/:quizID"
            element={<QuizControlPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
