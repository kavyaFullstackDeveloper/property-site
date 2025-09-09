// src/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchProperties, getFavorites, toggleFavorite } from "./api";

function Home() {
  const [highlighted, setHighlighted] = useState([]);
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();   // ✅ navigation hook

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
    navigate("/login");  // ✅ redirect after logout
  };

  const isFavorite = (id) => favorites.some((p) => p.id === id);

  const PropertyCard = ({ p }) => (
    <div key={p.id} style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
      <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <button
        onClick={() => handleFavorite(p)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer"
        }}
      >
        {isFavorite(p.id) ? "❤️" : "🤍"}
      </button>
      <div style={{ padding: "10px" }}>
        <h3>{p.name}</h3>
        <p>{p.currency} {p.price}</p>
        <p>{p.bedrooms} 🛏 | {p.bathrooms} 🛁</p>
        <p>{p.location.city}, {p.location.country}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        backgroundImage: "url('https://picsum.photos/1600/400?blur')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "60px",
        color: "white",
        textAlign: "center",
        position: "relative"
      }}>
        <h1>Welcome {username ? username : "Guest"} 👋</h1>
        <p>Find your dream property anywhere in the world</p>
        <input
          type="text"
          placeholder="Search by city..."
          value={search}
          onChange={handleSearch}
          style={{ padding: "10px", width: "60%", borderRadius: "5px", border: "none", marginTop: "20px" }}
        />

        {/* ✅ Logout Button */}
        {username && (
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "8px 16px",
              background: "rgba(255, 0, 0, 0.8)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        )}
      </div>

      {/* Highlighted Top 10 */}
      {highlighted.length > 0 && (
        <div style={{ padding: "20px" }}>
          <h2>🔍 Top 10 Matches</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
            {highlighted.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* Infinite Scroll Results */}
      <div style={{ padding: "20px" }}>
        <h2>🏠 More Properties</h2>
        <InfiniteScroll
          dataLength={properties.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: "center" }}>No more properties</p>}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
            {properties.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Home;
