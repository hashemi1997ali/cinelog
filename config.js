export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const API_TOKEN = getApiToken();

function getApiToken() {
  const token = import.meta.env.VITE_TMDB_API_TOKEN;
  if (!token) {
    console.warn("Warning: VITE_TMDB_API_TOKEN not set in environment");
  }
  return token;
}

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};
