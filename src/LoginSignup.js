// src/LoginSignup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function getUsersFromCookies() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("users="));
  return cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : [];
}

function saveUsersToCookies(users) {
  document.cookie = `users=${encodeURIComponent(JSON.stringify(users))}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

function LoginSignup({ setUsername }) {
  const [mode, setMode] = useState("login");
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = () => {
    let users = getUsersFromCookies();

    if (mode === "signup") {
      if (users.find((u) => u.username === username)) {
        setError("User already exists. Please login.");
        return;
      }
      const newUser = { username, password };
      users.push(newUser);
      saveUsersToCookies(users);
      localStorage.setItem("token", "dummy-jwt-token");
      localStorage.setItem("username", username);
      setUsername(username);
      navigate("/");
    } else {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) {
        setError("Invalid credentials or user not found.");
        return;
      }
      localStorage.setItem("token", "dummy-jwt-token");
      localStorage.setItem("username", username);
      setUsername(username);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('https://picsum.photos/1600/900?blur')",
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "20px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <img
          src="https://picsum.photos/200"
          alt="auth"
          style={{ marginBottom: "20px", borderRadius: "50%" }}
        />
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <button
          onClick={handleAuth}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: mode === "login" ? "blue" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p style={{ marginTop: "15px" }}>
          {mode === "login" ? "New user?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setError("");
              setMode(mode === "login" ? "signup" : "login");
            }}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
