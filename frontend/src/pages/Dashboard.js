import React from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import checkUserAuth from "../utils/checkUserAuth";

import CreateCategory from "../components/createCategory";

export default function Dashboard() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const { userName } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (!checkUserAuth(cookies)) {
        window.location.href = "/dashboard/" + cookies.user.userName;
      }
    }
  }, []);
  const checkUser = async () => {
    if (
      !cookies.user ||
      cookies.user.userName !== userName ||
      !cookies.accessToken
    ) {
      window.location.href = "/login";
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    removeCookie("user", { path: "/" });
    removeCookie("accessToken", { path: "/" });
    window.location.href = "/login";
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div>
      <h1>Hello {isAuthenticated ? userName : "unknown user"}</h1>{" "}
      <button onClick={logout}>Logout</button>
      <CreateCategory />
    </div>
  );
}
