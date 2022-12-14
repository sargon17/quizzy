import React from "react";
import { Link } from "react-router-dom";

import LogoBlue from "../resources/images/Logo_blue.svg";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

import { useLocation } from "react-router-dom";

import Logout from "./utils/Logout";

export default function SideBar({ logout }) {
  const user = useSelector(userDataSelector);

  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="dashboard-sidebar">
      <div className="logo-wrapper">
        <Link to={"/"}>
          <img src={LogoBlue} />
        </Link>
      </div>
      <div className="dashboard-sidebar__main">
        <h2 className="welcome-message"> Welcome, {user.userName}</h2>
        <nav className="nav">
          <ul>
            <li
              className={
                path === `/dashboard` ? "nav-item nav-item--active" : "nav-item"
              }
            >
              <Link to={`/dashboard`} className="link">
                Dashboard
              </Link>
            </li>
            <li
              className={
                path === "/dashboard/create-quiz"
                  ? "nav-item nav-item--active"
                  : "nav-item"
              }
            >
              <Link to={"/dashboard/create-quiz"} className="link">
                Create new quiz
              </Link>
            </li>
            <li
              className={
                path === "/dashboard/quizzes"
                  ? "nav-item nav-item--active"
                  : "nav-item"
              }
            >
              <Link to={"/dashboard/quizzes"} className="link">
                manage quizzes
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/dashboard/categories"} className="link">
                Categories
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to={"/dashboard/sub-categories"} className="link">
                View Stats
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to={"/dashboard"} className="link">
                View Stats
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-sidebar__footer">
        <Logout />
      </div>
    </div>
  );
}
