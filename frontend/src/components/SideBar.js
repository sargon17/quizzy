import React from "react";
import { Link } from "react-router-dom";

import LogoBlue from "../resources/images/Logo_blue.svg";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

export default function SideBar({ logout }) {
  const user = useSelector(userDataSelector);

  return (
    <div className="dashboard-sidebar">
      <div className="logo-wrapper">
        <Link to={"/"}>
          <img src={LogoBlue} />
        </Link>
      </div>
      <div className="dashboard-sidebar__main">
        <h2 className="welcome-message"> Welcome {user.userName}</h2>
        <nav className="nav">
          <ul>
            <li className="nav-item nav-item--active">
              <Link to={`/dashboard/${user.userName}`} className="link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/dashboard/create-quiz"} className="link">
                Create new quiz
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/dashboard"} className="link">
                manage new quizzes
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/dashboard"} className="link">
                View Stats
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
