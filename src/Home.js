// src/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchProperties, getFavorites, toggleFavorite } from "./api";

function Home({ username, setUsername }) {
  const [highlighted, setHighlighted] = useState([]);
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      setFavorites(getFavorites(username));
    }
    loadMore();
  }, []);

  const loadMore = async () => {
    const newProps = await fetchProperties(page, 10, search);
    if (newProps.length === 0) {
      setHasMore(false);
      return;
    }
    setProperties((prev) => [...prev, ...newProps]);
    setPage((prev) => prev + 1);
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearch(term);
    setPage(1);

    if (term.trim() === "") {
      setHighlighted([]);
      setProperties([]);
      setHasMore(true);
      loadMore();
      return;
    }

    const allResults = await fetchProperties(1, 1000, term);
    const top10 = allResults.slice(0, 10);
    setHighlighted(top10);

    const rest = allResults.slice(10, 20);
    setProperties(rest);
    setPage(3);
    setHasMore(allResults.length > 20);
  };

  const handleFavorite = (property) => {
    if (!username) {
      alert("Please log in to save favorites.");
      return;
    }
    const updated = toggleFavorite(username, property);
    setFavorites(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);
    navigate("/login");
  };

  const isFavorite = (id) => favorites.some((p) => p.id === id);

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
        {isFavorite(p.id) ? "❤️" : "🤍"}
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
    <div>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: "url('https://picsum.photos/1600/400?blur')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
          position: "relative",
          padding: "100px 20px",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            display: "inline-block",
            padding: "30px 40px",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
            Welcome {username ? username : "Guest"} 👋
          </h1>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Find your dream property anywhere in the world
          </p>
          <input
            type="text"
            placeholder="Search by city..."
            value={search}
            onChange={handleSearch}
            style={{
              padding: "12px",
              width: "70%",
              maxWidth: "400px",
              borderRadius: "25px",
              border: "none",
              outline: "none",
            }}
          />
        </div>

        {username && (
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "8px 16px",
              background: "rgba(255, 0, 0, 0.85)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        )}
      </div>

      {/* Highlighted Top 10 */}
      {highlighted.length > 0 && (
        <div style={{ padding: "30px" }}>
          <h2 style={{ marginBottom: "20px" }}>🔍 Top 10 Matches</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {highlighted.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      )}

      {/* Infinite Scroll Results */}
      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>🏠 More Properties</h2>
        <InfiniteScroll
          dataLength={properties.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>No more properties</p>
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {properties.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Home;
