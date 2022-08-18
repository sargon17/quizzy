import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizControlPage from "./pages/QuizControlPage";
import CategoryPage from "./pages/CategoryPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="flex justify-center">
            <ul className="flex justify-center">
              <li>
                <Link
                  to="/"
                  className="p-4 transition-all duration-300 hover:text-blue-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="p-4 transition-all duration-300 hover:text-blue-500"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="p-4 transition-all duration-300 hover:text-blue-500"
                >
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/:userName" element={<Dashboard />} />
          <Route path="/category/:categoryID" element={<CategoryPage />} />
          <Route
            path="/quiz-controller/:quizID"
            element={<QuizControlPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
