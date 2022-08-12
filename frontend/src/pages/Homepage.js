import React from "react";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
// import { Link } from "react-router-dom";

import checkUserAuth from "../utils/checkUserAuth";

export default function Homepage() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({ userName: "", email: "" });
  //   check if user is authenticated
  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (checkUserAuth(cookies)) {
        setIsAuthenticated(true);
        setUserData({
          userName: cookies.user.userName,
          email: cookies.user.email,
        });
      }
    }
  }, []);

  return (
    <div>
      <h1>Homepage</h1>
      <h2>
        {isAuthenticated
          ? `Welcome ${userData.userName}`
          : "User Not Authenticated"}
      </h2>
    </div>
  );
}
