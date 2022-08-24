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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const user = useSelector(userDataSelector);
  // const dispatch = useDispatch();

  // check if user is authenticated
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
      // dispatch(setUserData(cookies.user));
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
    <div className=" h-screen grid grid-cols-5 gap-5">
      <div className="sidebar">
        <SideBar logout={logout} />
      </div>
      <div className="col-span-4">{children}</div>
    </div>
  );
}
