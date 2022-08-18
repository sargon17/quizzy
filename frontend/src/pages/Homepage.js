import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import { useCookies } from "react-cookie";
// import { Link } from "react-router-dom";

import checkUserAuth from "../utils/checkUserAuth";

import DisplayCategories from "../components/DisplayCategories";

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
      <div className=" h-96 flex justify-center items-center ">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Homepage</h1>
          <h2>
            {isAuthenticated
              ? `Welcome ${userData.userName}`
              : "User Not Authenticated"}
          </h2>
        </div>
      </div>
      <DisplayCategories />
    </div>
  );
}
