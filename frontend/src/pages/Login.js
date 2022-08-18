import React from "react";

import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

import checkUserAuth from "../utils/checkUserAuth";

import "../scss/style.scss";

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({ isOn: false, message: "Error" });

  //   check if user is authenticated and redirect to dashboard if so
  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (checkUserAuth(cookies)) {
        window.location.href = "/dashboard/" + cookies.user.userName;
      }
    }
  }, []);

  const loginUser = async () => {
    setError({ isOn: false, message: "" });
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("email", userData.email);
    urlencoded.append("password", userData.password);

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:5000/user/signin", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== 200) {
          setError({ isOn: true, message: result.message });
        }
        // console.log(result);
        if (result.accessToken) {
          setCookie("accessToken", result.accessToken, { path: "/" });
        }
        if (result.user) {
          setCookie("user", result.user, { path: "/" });
          window.location.href = "/dashboard/" + result.user.userName;
        }
        // console.log(cookies);
      })
      .catch((error) => {
        // console.log(error);
        setError({ isOn: true, message: "Error" });
      });
  };

  return (
    <div>
      <div className="h-screen flex justify-center items-center ">
        <div>
          <h1 className="text-center font-bold text-2xl text-blue-500 ">
            Login
          </h1>
          <div className="my-5">
            {error.isOn && <div> {error.message} </div>}
            <label htmlFor="email">email</label>
            <input
              className="border border-blue-500 rounded-lg p-2 w-full"
              type="text"
              name="email"
              id="email"
              value={userData.email}
              onChange={(e) =>
                setUserData((prevReg) => {
                  return { ...prevReg, email: e.target.value };
                })
              }
            />
          </div>
          <div className="my-5">
            <label htmlFor="password">password</label>
            <input
              className="border border-blue-500 rounded-lg p-2 w-full"
              type="password"
              name="password"
              id="password"
              value={userData.password}
              onChange={(e) =>
                setUserData((prevReg) => {
                  return { ...prevReg, password: e.target.value };
                })
              }
            />
          </div>
          <button
            className="btn btn-primary btn-round-s btn-full-w"
            onClick={() => {
              loginUser();
            }}
            disabled={!userData.email || !userData.password}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
