import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, options } from "./config.js";
const moviesGrid = document.querySelector("#movies-grid");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const currentPageSpan = document.querySelector("#current-page");
const totalPagesSpan = document.querySelector("#total-pages");
const mobMenuBtn = document.querySelector("#mob-menu-btn");
const mobNav = document.querySelector("#mob-nav");
const mobMenuOverlay = document.querySelector("#mob-menu-overlay");
const mobNavLinks = mobNav?.querySelectorAll("a");
const heroImage = document.querySelector("#hero-image");

const PLACEHOLDER_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
heroImage.src = PLACEHOLDER_IMAGE;

let language = "en-US";
let currentPage = 1;
let totalPages = 1;
let movies = [];
let heroMovies = [];
let currentHeroIndex = 0;
let heroInterval;

const STORAGE_KEY = "cinelog_favourites";

function getFavourites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveFavourites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function isFavourite(movieId) {
  return getFavourites().some((m) => m.id === movieId);
}

function toggleFavourite(movie) {
  let favs = getFavourites();
  if (isFavourite(movie.id)) {
    favs = favs.filter((m) => m.id !== movie.id);
  } else {
    favs.unshift({ ...movie, note: "" });
  }
  saveFavourites(favs);
  updateFavBadge();
}
function updateFavBadge() {
  const count = getFavourites().length;
  const badge = document.getElementById("fav-count-badge");
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove("hidden");
    badge.classList.add("flex");
  } else {
    badge.classList.add("hidden");
    badge.classList.remove("flex");
  }
}

/* RATING BADGE  */

function ratingBadge(rating) {
  const item = rating.toFixed(1);
  let cls = "rating-mid";
  if (rating >= 7) cls = "rating-high";
  if (rating < 5) cls = "rating-low";
  return `<span class="${cls}"><i class="fa-solid fa-star text-[10px]"></i> ${item}</span>`;
}

function openMobileMenu() {
  mobMenuBtn?.classList.add("active");
  mobNav?.classList.add("active");
  mobMenuOverlay?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobMenuBtn?.classList.remove("active");
  mobNav?.classList.remove("active");
  mobMenuOverlay?.classList.remove("active");
  document.body.style.overflow = "auto";
}

mobMenuBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (mobMenuBtn?.classList.contains("active")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobMenuOverlay?.addEventListener("click", closeMobileMenu);

mobNavLinks?.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});

async function fetchHeroMovie(language = "en-US", page = 1) {
  try {
    const url = `${TMDB_BASE_URL}/movie/now_playing?language=${language}&page=${page}`;
    const res = await fetch(url, options);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    heroMovies = data.results.filter((movie) => movie.backdrop_path);

    if (heroMovies.length > 0) {
      startHeroSlideshow();
    }
  } catch (error) {
    console.error("Error fetching hero movie:", error);
  }
}

function startHeroSlideshow() {
  if (heroInterval) {
    clearInterval(heroInterval);
  }

  updateHeroImage();

  heroInterval = setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length;
    updateHeroImage();
  }, 5000);
}

function updateHeroImage() {
  if (heroMovies.length > 0 && heroMovies[currentHeroIndex]) {
    const movie = heroMovies[currentHeroIndex];
    heroImage.style.opacity = "0";

    setTimeout(() => {
      heroImage.src = `${TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}`;
      heroImage.style.opacity = "0.3";
    }, 500);
  }
}

async function fetchMovies(language = "en-US", page = 1, shouldScroll = true) {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?language=${language}&page=${page}`;
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    totalPages = data.total_pages;
    movies = data.results;

    moviesGrid.innerHTML = "";

    movies.forEach((movie) => {
      renderMovie(movie);
    });

    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    if (shouldScroll) {
      const headerHeight = document.querySelector("#site-header").offsetHeight;
      const moviesSection = moviesGrid.closest("section");
      const sectionTop = moviesSection.offsetTop - headerHeight;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function toggleFavorite(movie, button) {
  const favorites = getFavourites();
  const existingIndex = favorites.findIndex((fav) => fav.id === movie.id);

  if (existingIndex > -1) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
    button.classList.remove("favorited");
    button.setAttribute("aria-label", "Add to favorites");
  } else {
    // Add to favorites
    const favoriteMovie = {
      ...movie,
      addedAt: new Date().toISOString(),
      note: "",
    };
    favorites.push(favoriteMovie);
    button.classList.add("favorited");
    button.setAttribute("aria-label", "Remove from favorites");
  }

  saveFavourites(favorites);
}

async function renderMovie(movie) {
  const movieCard = document.createElement("div");
  const moviePoster = document.createElement("img");
  const movieTitle = document.createElement("h3");
  const movieRating = document.createElement("p");
  const movieReleaseYear = document.createElement("p");
  const cardBottom = document.createElement("div");
  const favoriteBtn = document.createElement("button");

  movieCard.classList.add("movie-card");

  favoriteBtn.classList.add(
    "favorite-btn",
    "absolute",
    "top-3",
    "right-3",
    "w-8",
    "h-8",
    "rounded-full",
    "bg-bg-card/80",
    "backdrop-blur-sm",
    "flex",
    "items-center",
    "justify-center",
    "text-text-primary",
    "hover:text-accent",
    "transition-colors",
    "z-10",
  );
  favoriteBtn.setAttribute("aria-label", "Add to favorites");
  favoriteBtn.innerHTML = '<i class="fa-solid fa-bookmark text-sm"></i>';
  favoriteBtn.dataset.movieId = movie.id;

  const favorites = getFavourites();
  
  if (favorites.some((fav) => fav.id === movie.id)) {
    favoriteBtn.classList.add("favorited");
  }

  favoriteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(movie, favoriteBtn);
  });

  moviePoster.src = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}w500${movie.poster_path}`
    : PLACEHOLDER_IMAGE;
  moviePoster.alt = `${movie.title} Poster`;
  moviePoster.classList.add("w-full", "aspect-[2/3]", "object-cover");

  moviePoster.onerror = () => {
    moviePoster.src = PLACEHOLDER_IMAGE;
  };

  cardBottom.classList.add("px-5", "py-4", "grid", "grid-cols-2", "gap-2");

  movieTitle.textContent = movie.title;
  movieTitle.classList.add(
    "col-span-2",
    "text-xl",
    "lg:text-base",
    "xl:text-sm",
    "font-bold",
    "text-text-primary",
    "line-clamp-1",
  );

  function getRatingStyle(vote) {
    if (vote >= 7) {
      return ["bg-rating-high/20", "text-rating-high", "border-rating-high/40"];
    }

    if (vote >= 5) {
      return ["bg-rating-mid/20", "text-rating-mid", "border-rating-mid/40"];
    }

    return ["bg-rating-low/20", "text-rating-low", "border-rating-low/40"];
  }

  const style = getRatingStyle(movie.vote_average);

  movieRating.textContent = `★ ${movie.vote_average.toFixed(1)}`;
  movieRating.classList.add(
    "text-left",
    "w-fit",
    "text-base",
    "lg:text-sm",
    "xl:text-xs",
    "font-bold",
    "rounded-xl",
    "px-3",
    "py-1.5",
    ...style,
  );

  movieReleaseYear.textContent = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  movieReleaseYear.classList.add(
    "text-right",
    "text-base",
    "lg:text-sm",
    "xl:text-xs",
    "font-bold",
    "text-muted",
    "py-1.5",
  );

  movieCard.appendChild(moviePoster);
  movieCard.appendChild(favoriteBtn);
  movieCard.appendChild(cardBottom);
  cardBottom.appendChild(movieTitle);
  cardBottom.appendChild(movieRating);
  cardBottom.appendChild(movieReleaseYear);
  moviesGrid.appendChild(movieCard);
}

prevBtn?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(language, currentPage, true); // Scroll when using pagination
  }
});

nextBtn?.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovies(language, currentPage, true); // Scroll when using pagination
  }
});

/* SEARCH */
const searchDialog = document.getElementById("search-dialog");
const searchInput = document.getElementById("search-input");
const searchInitial = document.getElementById("search-initial");
const searchLoading = document.getElementById("search-loading");
const searchEmpty = document.getElementById("search-empty");
const searchResultsList = document.getElementById("search-results-list");
const queryDisplay = document.getElementById("search-query-display");

function openSearch() {
  searchDialog.classList.remove("hidden");
  searchInput?.focus();
  document.body.style.overflow = "hidden";
}

function closeSearch() {
  searchDialog.classList.add("hidden");
  document.body.style.overflow = "";
  resetSearchUI();
}

function resetSearchUI() {
  searchInput.value = "";
  searchInitial.classList.remove("hidden");
  searchLoading.classList.add("hidden");
  searchEmpty.classList.add("hidden");
  searchResultsList.classList.add("hidden");
  searchResultsList.innerHTML = "";
}

function showSearchState(state) {
  searchInitial.classList.add("hidden");
  searchLoading.classList.add("hidden");
  searchEmpty.classList.add("hidden");
  searchResultsList.classList.add("hidden");

  if (state === "loading") searchLoading.classList.remove("hidden");
  if (state === "empty") searchEmpty.classList.remove("hidden");
  if (state === "results") searchResultsList.classList.remove("hidden");
  if (state === "initial") searchInitial.classList.remove("hidden");
}

function searchResultHTML(movie) {
  const poster = `${TMDB_IMAGE_BASE_URL}/w92${movie.poster_path}`;
  const isFav = isFavourite(movie.id);

  return `
    <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-raised
                transition-colors duration-150 group" data-id="${movie.id}">
      <img src="${poster}" alt="${movie.title}"
           class="w-12 h-16 object-cover rounded-lg shrink-0" />
      <div class="flex-1 min-w-0">
        <p class="text-text-primary font-semibold text-sm truncate">${movie.title}</p>
        <div class="flex items-center gap-2 mt-0.5">
          ${ratingBadge(movie.vote_average)}
          <span class="text-muted text-xs">${movie.year}</span>
        </div>
      </div>
      <button class="search-fav-btn btn-outline text-xs px-3 py-1.5 shrink-0
                     ${isFav ? "border-accent text-accent" : ""}"
              data-id="${movie.id}">
        <i class="${isFav ? "fa-solid" : "fa-regular"} fa-bookmark text-xs"></i>
        ${isFav ? "Saved" : "Save"}
      </button>
    </div>
  `;
}

let searchTimeout;
async function handleSearchInput(e) {
  const query = e.target.value.trim();
  if (!query) {
    showSearchState("initial");
    return;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    showSearchState("loading");
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?&query=${encodeURIComponent(query)}&language=en-US`,
        options,
      );
      const data = await res.json();
      const results = data.results || [];

      if (results.length === 0) {
        queryDisplay.textContent = `"${query}"`;
        showSearchState("empty");
        return;
      }

      searchResultsList.innerHTML = results
        .slice(0, 8)
        .map(searchResultHTML)
        .join("");
      showSearchState("results");

      searchResultsList.querySelectorAll(".search-fav-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = Number(btn.dataset.id);
          const movie = results.find((m) => m.id === id);
          if (!movie) return;
          toggleFavourite(movie);
          const isFav = isFavourite(id);
          btn.innerHTML = `<i class="${isFav ? "fa-solid" : "fa-regular"} fa-bookmark text-xs"></i> ${isFav ? "Saved" : "Save"}`;
          btn.classList.toggle("border-accent", isFav);
          btn.classList.toggle("text-accent", isFav);
        });
      });
    } catch (err) {
      console.error("search error:", err);
      queryDisplay.textContent = `"${query}"`;
      showSearchState("empty");
    }
  }, 400);
}

const openBtns = [
  document.getElementById("open-search"),
  document.getElementById("open-search-mobile"),
];
openBtns.forEach((btn) => btn?.addEventListener("click", openSearch));

document.getElementById("close-search")?.addEventListener("click", closeSearch);

searchDialog?.addEventListener("click", (e) => {
  if (e.target === searchDialog) closeSearch();
});

searchInput?.addEventListener("input", handleSearchInput);

fetchMovies(language, currentPage, false); // Don't scroll on initial load
fetchHeroMovie();
