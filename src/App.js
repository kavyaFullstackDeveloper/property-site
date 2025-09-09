// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import LoginSignup from "./LoginSignup";

function App() {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link to="/" style={{ margin: "10px" }}>Home</Link>
          <Link to="/login" style={{ margin: "10px" }}>Login / Sign Up</Link>
        </div>
        {username && (
          <div>
            Welcome, <b>{username}</b>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
