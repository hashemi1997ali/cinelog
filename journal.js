import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, options } from "./config.js";
/* STORAGE */
const STORAGE_KEY = "cinelog_favourites";

function getFavourites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveFavourites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

/* RATING BADGE  */

function ratingBadge(rating) {
  const item = rating.toFixed(1);
  let cls = "rating-mid";
  if (rating >= 7) cls = "rating-high";
  if (rating < 5) cls = "rating-low";
  return `<span class="${cls}"><i class="fa-solid fa-star text-[10px]"></i> ${item}</span>`;
}

/* JOURNAL CARD */

const IMG_BASE = "https://image.tmdb.org/t/p";

function journalCardHTML(movie) {
  console.log('movie', movie);
  
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

document.addEventListener("DOMContentLoaded", () => {
  renderJournal();
});
