import React from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { userDataSelector } from "../features/user/userDataSlice";

export default function Header({ isAuthenticated, logout }) {
  const user = useSelector(userDataSelector);
  return (
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
  );
}
