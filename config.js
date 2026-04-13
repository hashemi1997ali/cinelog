export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
export const API_KEY  = '9bd188a593d0288c80e0e7cd79e90ccc';

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWYyOTllYzgyMzQyNzYxMDA1NDNhYmZkNDYxYjNkMSIsIm5iZiI6MTc3NTUxMjgzMS45NzEsInN1YiI6IjY5ZDQyY2ZmYmYyOGI1MzhjNTMxMzhjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pd5WZek8sfSRgppMPO9IeGVPRzV_nE_VgV242-qlXSU";

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};
