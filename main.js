const siteHeader = document.querySelector("#site-header");
const searchToggle = document.querySelector("#search-toggle");
const searchClose = document.querySelector("#search-close");
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const moviesGrid = document.querySelector("#movies-grid");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const currentPageSpan = document.querySelector("#current-page");
const totalPagesSpan = document.querySelector("#total-pages");
const heroImage = document.querySelector("#hero-image");

let language = "en-US";
let currentPage = 1;
let totalPages = 1;
let movies = [];
let heroMovies = [];
let currentHeroIndex = 0;
let heroInterval;

const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const PLACEHOLDER_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmRlZDIwZTMxYmQ2OTM3ZGFjYTc4NjM3YTE4NWE2MCIsIm5iZiI6MTc3NTUxMjgzMS45NzEsInN1YiI6IjY5ZDQyY2ZmYmYyOGI1MzhjNTMxMzhjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KGd9PEUTdMvp8tdF9k8dKPKIgmo-Z5SAw8bG8tK2zJk",
  },
};

heroImage.src = PLACEHOLDER_IMAGE;

function openSearch() {
  siteHeader?.classList.add("search-open");

  setTimeout(() => {
    searchInput?.focus();
  }, 220);
}

function closeSearch() {
  siteHeader?.classList.remove("search-open");

  if (searchInput) {
    searchInput.value = "";
  }
}

const mobMenuBtn = document.querySelector("#mob-menu-btn");
const mobNav = document.querySelector("#mob-nav");
const mobMenuOverlay = document.querySelector("#mob-menu-overlay");
const mobNavLinks = mobNav?.querySelectorAll("a");

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

searchToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  openSearch();
});

searchClose?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeSearch();
});

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = searchInput?.value.trim();
  if (!query) return;

  console.log("Search query:", query);

  closeSearch();
});

searchForm?.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  const isOpen = siteHeader?.classList.contains("search-open");
  if (!isOpen) return;

  const clickedInsideForm = searchForm?.contains(e.target);
  const clickedToggle = searchToggle?.contains(e.target);

  if (!clickedInsideForm && !clickedToggle) {
    closeSearch();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
  }
});

async function fetchHeroMovie(language = "en-US", page = 1) {
  try {
    const url = `${TMDB_BASE_URL}/now_playing?language=${language}&page=${page}`;
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
    const url = `${TMDB_BASE_URL}/popular?language=${language}&page=${page}`;
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

const STORAGE_KEY = "cinelog_favourites";

function getFavorites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function toggleFavorite(movie, button) {
  const favorites = getFavorites();
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

  saveFavorites(favorites);
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

  const favorites = getFavorites();
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

fetchMovies(language, currentPage, false); // Don't scroll on initial load
fetchHeroMovie();
