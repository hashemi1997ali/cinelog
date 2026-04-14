import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, options } from "./config.js";
const mobMenuBtn = document.querySelector("#mob-menu-btn");
const mobNav = document.querySelector("#mob-nav");
const mobMenuOverlay = document.querySelector("#mob-menu-overlay");
const mobNavLinks = mobNav?.querySelectorAll("a");
/* STORAGE */
const STORAGE_KEY = "cinelog_favourites";

function getFavourites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveFavourites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
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
          renderJournal();
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

/* MOB MENU  */
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

/* RATING BADGE  */

function ratingBadge(rating) {
  const item = rating.toFixed(1);
  let cls = "rating-mid";
  if (rating >= 7) cls = "rating-high";
  if (rating < 5) cls = "rating-low";
  return `<span class="${cls}"><i class="fa-solid fa-star text-[10px]"></i> ${item}</span>`;
}

/* JOURNAL CARD */

function journalCardHTML(movie) {
  return `
    <div class="journal-card animate-fade-up" data-id="${movie.id}">

      <img
        class="journal-poster"
        src="${TMDB_IMAGE_BASE_URL}/w342${movie.poster_path}"
        alt="${movie.title}"
      />

      <div class="flex-1 p-5 flex flex-col gap-4">

        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-text-primary font-semibold text-lg leading-snug">
              ${movie.title}
            </h2>
            <div class="flex items-center gap-2 mt-1.5">
              ${ratingBadge(movie.vote_average)}
              <span class="text-muted text-xs">${movie.year}</span>
            </div>
          </div>
          <button
            class="remove-btn btn-danger text-xs px-3 py-1.5"
            data-id="${movie.id}"
            title="Remove from journal"
          >
            <i class="fa-solid fa-trash-can text-xs"></i>
            Remove
          </button>
        </div>

        <p class="text-text-body text-sm leading-relaxed">
          ${movie.overview || "No description available."}
        </p>

        <div class="flex flex-col gap-2">
          <label class="text-accent text-xs font-semibold uppercase tracking-widest">
            <i class="fa-solid fa-pen text-[10px] mr-1"></i>
            My Notes
          </label>
          <textarea
            class="note-textarea"
            rows="3"
            placeholder="Write your thoughts about this film…"
            data-id="${movie.id}"
          >${movie.note || ""}</textarea>
          <div class="flex items-center justify-between">
            <p class="note-saved-msg text-xs text-accent hidden" data-id="${movie.id}">
              <i class="fa-solid fa-check mr-1"></i>Note saved
            </p>
            <button
              class="save-note-btn btn-gold text-xs px-4 py-1.5 ml-auto"
              data-id="${movie.id}"
            >
              Save note
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function updateStats(favs) {
  const statCount = document.getElementById("stat-count");
  const statNotes = document.getElementById("stat-notes");
  statCount.textContent = favs.length;
  statNotes.textContent = favs.filter((x) => x.note?.trim()).length;
}

function renderJournal() {
  const favs = getFavourites();
  const list = document.getElementById("journal-list");
  const emptyMsg = document.getElementById("journal-empty");

  updateStats(favs);

  if (favs.length === 0) {
    list.innerHTML = "";
    emptyMsg.classList.remove("hidden");
    return;
  }

  emptyMsg.classList.add("hidden");
  list.innerHTML = favs.map(journalCardHTML).join("");

  list.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const card = list.querySelector(`.journal-card[data-id="${id}"]`);

      card.style.transition = "opacity 0.2s, transform 0.2s";
      card.style.opacity = "0";
      card.style.transform = "translateX(20px)";

      setTimeout(() => {
        let favs = getFavourites().filter((x) => x.id !== id);
        saveFavourites(favs);
        renderJournal();
      }, 200);
    });
  });

  list.querySelectorAll(".save-note-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const textarea = list.querySelector(`textarea[data-id="${id}"]`);
      const savedMsg = list.querySelector(`.note-saved-msg[data-id="${id}"]`);

      let favs = getFavourites();
      const idx = favs.findIndex((x) => x.id === id);
      favs[idx].note = textarea.value.trim();
      saveFavourites(favs);

      savedMsg.classList.remove("hidden");
      setTimeout(() => savedMsg.classList.add("hidden"), 2000);

      updateStats(getFavourites());
    });
  });
}

/* INIT  */

document.addEventListener("DOMContentLoaded", renderJournal);
