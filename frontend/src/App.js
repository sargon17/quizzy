import { useCookies } from "react-cookie";
import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  return (
    <Router>
      <div className="App">
        <Link to="/login">Login</Link>
        <br />
        <Link to="/register">Register</Link>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/:userName" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
