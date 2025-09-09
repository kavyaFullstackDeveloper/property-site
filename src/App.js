// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import LoginSignup from "./LoginSignup";
import Favorites from "./Favorites";   // ✅ import

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  return (
    <Router>
      {/* ✅ Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: "22px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          🏡 PropFinder
        </Link>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Home
          </Link>

          {username && (
            <Link
              to="/favorites"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              ⭐ Favorites
            </Link>
          )}

          {!username ? (
            <Link
              to="/login"
              style={{
                background: "white",
                color: "#3b82f6",
                padding: "8px 16px",
                borderRadius: "20px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "0.3s",
              }}
            >
              Login / Sign Up
            </Link>
          ) : (
            <span style={{ fontWeight: "500" }}>Welcome, {username}</span>
          )}
        </div>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route
          path="/"
          element={<Home username={username} setUsername={setUsername} />}
        />
        <Route
          path="/login"
          element={<LoginSignup setUsername={setUsername} />}
        />
        <Route
          path="/favorites"
          element={<Favorites username={username} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
