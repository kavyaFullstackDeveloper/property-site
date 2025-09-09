// src/api.js

const cities = [
  "New York", "London", "Paris", "Tokyo", "Sydney",
  "Dubai", "Berlin", "Toronto", "San Francisco", "Singapore",
  "Rome", "Bangkok", "Istanbul", "Los Angeles", "Chicago",
  "Seoul", "Madrid", "Amsterdam", "Mumbai", "Mexico City"
];

let dummyProperties = Array.from({ length: 200 }).map((_, i) => {
  const city = cities[i % cities.length];
  return {
    id: i + 1,
    name: `Luxury Apartment ${i + 1}`,
    price: (100000 + i * 5000).toFixed(2),
    currency: "USD",
    location: { city, country: "Country X" },
    area: { size: 100 + i, unit: "sqm" },
    bedrooms: (i % 5) + 1,
    bathrooms: (i % 3) + 1,
    propertyType: "Apartment",
    status: i % 2 === 0 ? "For Sale" : "For Rent",
    rating: (Math.random() * 5).toFixed(2),
    amenities: ["Pool", "Gym", "Parking"],
    agent: { name: "Agent " + (i % 10), contact: "123456789" },
    dateListed: new Date().toISOString(),
    images: [
      `https://picsum.photos/seed/${i}/400/250`,
      `https://picsum.photos/seed/${i + 1}/400/250`
    ]
  };
});

// ✅ helper for paginated + search
export function fetchProperties(page, limit = 10, search = "") {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = dummyProperties;
      if (search) {
        results = results.filter((p) =>
          p.location.city.toLowerCase().includes(search.toLowerCase())
        );
      }
      const start = (page - 1) * limit;
      const end = start + limit;
      resolve(results.slice(start, end));
    }, 500);
  });
}

// dummy login/signup
export function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        resolve({ token: "dummy-jwt-token", username });
      } else {
        reject("Invalid credentials");
      }
    }, 500);
  });
}

// Favorites handling
export function getFavorites(username) {
  const data = JSON.parse(localStorage.getItem("favorites")) || {};
  return data[username] || [];
}

export function toggleFavorite(username, property) {
  const data = JSON.parse(localStorage.getItem("favorites")) || {};
  const userFavs = data[username] || [];
  const exists = userFavs.find((p) => p.id === property.id);

  let updated;
  if (exists) {
    updated = userFavs.filter((p) => p.id !== property.id);
  } else {
    updated = [...userFavs, property];
  }
  data[username] = updated;
  localStorage.setItem("favorites", JSON.stringify(data));
  return updated;
}
