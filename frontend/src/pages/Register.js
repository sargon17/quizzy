import React from "react";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import checkUserAuth from "../utils/checkUserAuth";
export default function Register() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [registration, setRegistration] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const registerUser = async () => {
    console.log(registration);

    // control if passwords match
    if (registration.password !== registration.confirmPassword) {
      setError({ isOn: true, message: "Passwords do not match" });
      return;
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("userName", registration.userName);
    urlencoded.append("email", registration.email);
    urlencoded.append("password", registration.password);
    urlencoded.append("confirmPassword", registration.confirmPassword);

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:5000/user/signup", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== 200) {
          setError({ isOn: true, message: result.message });
        }
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
    <div className="h-screen flex justify-center items-center">
      <div>
        <h1 className="text-center font-bold text-2xl text-blue-500 ">
          Register
        </h1>
        {error.isOn && (
          <div>
            {" "}
            <p> {error.message} </p>{" "}
          </div>
        )}
        <div className="my-5">
          <div className="my-2">
            <label htmlFor="userName">Username*</label>
            <input
              className="border border-blue-500 rounded-lg p-2 w-full"
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
          <div className="my-2">
            <label htmlFor="email">email*</label>
            <input
              className="border border-blue-500 rounded-lg p-2 w-full"
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
          <div className="my-2">
            <label htmlFor="password">Password*</label>
            <input
              className="border border-blue-500 rounded-lg p-2 w-full"
              type="password"
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
          <div className="my-2">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              className="border border-blue-500 rounded-lg p-2 w-full"
              type="password"
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
            className="btn btn-primary btn-round-s btn-full-w"
            onClick={() => {
              registerUser();
            }}
            disabled={
              registration.userName === "" ||
              registration.email === "" ||
              registration.password === "" ||
              registration.confirmPassword === ""
            }
          >
            Register
          </button>
          <div className="my-5 text-center">
            <p>
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="transition-all duration-300 hover:text-blue-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
