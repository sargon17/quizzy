import React from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setUserData, userDataSelector } from "../features/user/userDataSlice";

import checkUserAuth from "../utils/checkUserAuth";

import SideBar from "../components/SideBar";

export default function Dashboard({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const { userName } = useParams();

  // const user = useSelector(userDataSelector);
  // const dispatch = useDispatch();

  // check if user is authenticated
  const checkAuth = async () => {
    if (cookies.user && cookies.accessToken) {
      if (await !checkUserAuth(cookies)) {
        window.location.href = "/login";
      }
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    removeCookie("user", { path: "/" });
    removeCookie("accessToken", { path: "/" });
    window.location.href = "/login";
  };

  return (
    <div className=" h-screen grid grid-cols-5 gap-5">
      <div className="sidebar">
        <SideBar logout={logout} />
      </div>
      <div className="col-span-4 max-h-screen overflow-scroll">{children}</div>
    </div>
  );
}
