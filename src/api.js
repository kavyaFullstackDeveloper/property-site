const BASE_URL = "https://prop-django-4.onrender.com/api";

// 🔹 Fetch properties with pagination & optional search
export async function fetchProperties(page = 1, pageSize = 10, search = "") {
  try {
    const url = new URL(`${BASE_URL}/properties/`);
    url.searchParams.append("page", page);
    url.searchParams.append("page_size", pageSize);
    if (search) url.searchParams.append("search", search);

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch properties: ${res.status}`);
    }

    const data = await res.json();

    // ✅ Handle paginated or raw list
    if (Array.isArray(data)) return data;
    if (data.results) return data.results;
    return [];
  } catch (err) {
    console.error("❌ API Fetch Error:", err);
    return [];
  }
}

// 🔹 Favorites stored in localStorage (per user)
export function getFavorites(username) {
  return JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];
}

export function toggleFavorite(username, property) {
  let favorites = getFavorites(username);
  const exists = favorites.find((p) => p.id === property.id);
  if (exists) {
    favorites = favorites.filter((p) => p.id !== property.id);
  } else {
    favorites.push(property);
  }
  localStorage.setItem(`favorites_${username}`, JSON.stringify(favorites));
  return favorites;
}
