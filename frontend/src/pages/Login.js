import React from "react";

import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

import checkUserAuth from "../utils/checkUserAuth";

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  //   check if user is authenticated and redirect to dashboard if so
  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (checkUserAuth(cookies)) {
        window.location.href = "/dashboard/" + cookies.user.userName;
      }
    }
  }, []);

  const loginUser = async () => {
    // TODO: validate login
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
        console.log(result);
        if (result.accessToken) {
          setCookie("accessToken", result.accessToken, { path: "/" });
        }
        if (result.user) {
          setCookie("user", result.user, { path: "/" });
          window.location.href = "/dashboard/" + result.user.userName;
        }
        console.log(cookies);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label htmlFor="email">email</label>
        <input
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
      <div>
        <label htmlFor="password">password</label>
        <input
          type="text"
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
        onClick={() => {
          loginUser();
        }}
      >
        Login
      </button>
    </div>
  );
}
