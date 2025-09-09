// src/Favorites.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites, toggleFavorite } from "./api";

function Favorites({ username }) {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }
    setFavorites(getFavorites(username));
  }, [username, navigate]);

  const handleFavorite = (property) => {
    const updated = toggleFavorite(username, property);
    setFavorites(updated);
  };

  const PropertyCard = ({ p }) => (
    <div
      key={p.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={p.images[0]}
        alt={p.name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <button
        onClick={() => handleFavorite(p)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ❤️
      </button>
      <div style={{ padding: "12px" }}>
        <h3 style={{ margin: "0 0 5px" }}>{p.name}</h3>
        <p style={{ margin: "0", fontWeight: "bold" }}>
          {p.currency} {p.price}
        </p>
        <p style={{ margin: "5px 0" }}>
          {p.bedrooms} 🛏 | {p.bathrooms} 🛁
        </p>
        <p style={{ margin: "0", color: "#555" }}>
          {p.location.city}, {p.location.country}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>⭐ Your Favorite Properties</h1>
      {favorites.length === 0 ? (
        <p>You haven’t added any properties to favorites yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {favorites.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
