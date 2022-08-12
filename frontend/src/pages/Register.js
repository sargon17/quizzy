import React from "react";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

import checkUserAuth from "../utils/checkUserAuth";
export default function Register() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [registration, setRegistration] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //   check if user is authenticated and redirect to dashboard if so
  useEffect(() => {
    if (cookies.user && cookies.accessToken) {
      if (checkUserAuth(cookies)) {
        window.location.href = "/dashboard/" + cookies.user.userName;
      }
    }
  }, []);

  const registerUser = async () => {
    console.log(registration);

    // TODO: validate registration
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("userName", registration.userName);
    urlencoded.append("email", registration.email);
    urlencoded.append("password", registration.password);
    // TODO: implement confirm password control
    // urlencoded.append("confirmPassword", registration.confirmPassword);

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:5000/user/signup", requestOptions)
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
      <h1>Register</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
      </p>
      <div>
        <div>
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={registration.userName}
            onChange={(e) =>
              setRegistration((prevReg) => {
                return { ...prevReg, userName: e.target.value };
              })
            }
          />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={registration.email}
            onChange={(e) =>
              setRegistration((prevReg) => {
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
            value={registration.password}
            onChange={(e) =>
              setRegistration((prevReg) => {
                return { ...prevReg, password: e.target.value };
              })
            }
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">confirmPassword</label>
          <input
            type="text"
            name="confirmPassword"
            id="confirmPassword"
            value={registration.confirmPassword}
            onChange={(e) =>
              setRegistration((prevReg) => {
                return { ...prevReg, confirmPassword: e.target.value };
              })
            }
          />
        </div>
        <button
          onClick={() => {
            registerUser();
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
