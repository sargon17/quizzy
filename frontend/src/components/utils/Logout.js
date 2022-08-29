import React from "react";
import { useCookies } from "react-cookie";

export default function Logout() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const logout = () => {
    removeCookie("user", { path: "/" });
    removeCookie("accessToken", { path: "/" });
    window.location.href = "/login";
  };
  return (
    <>
      <button onClick={logout} className="btn btn-secondary btn-sm btn-round-s">
        Logout
      </button>
    </>
  );
}
