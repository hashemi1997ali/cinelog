# 🎬 CineLog

CineLog is a sleek movie discovery and personal journal web app built with **HTML, Tailwind CSS, and Vanilla JavaScript**.

Browse trending movies, search titles instantly, save favourites, and keep personal notes about the films you watch. Because apparently relaxing with a movie now requires personal analytics.

---

## 🌐 Live Demo

🔗 **Website:**  
Click [here](https://hashemi1997ali.github.io/cinelog) to view the live demo.

---

## 👥 Team

- Ali
- Andrew

---

## 📖 Project Overview

CineLog is an imaginary movie platform where users can discover films, save favourites, and write personal notes.

The goal of this project was to design and build a real-world style web application while focusing on:

- Working with external APIs
- Building a responsive multi-page interface
- Managing user data with LocalStorage
- Creating clean and modern UI components
- Practicing JavaScript application logic

---

## ✨ Features of the Website

### 🎥 Discover Popular Movies

- Real-time movie data powered by **TMDB API**
- Browse trending and popular titles
- Responsive movie grid layout
- Pagination navigation

### 🔍 Live Search

- Instant movie search by title
- Debounced input for smoother UX
- Loading, empty, and results states
- Save directly from search results

### 📚 Personal Journal

- Save favourite movies
- Write private notes for each film
- Remove entries anytime
- Auto-updating journal statistics

### 🌟 Hero Section

- Dynamic slideshow background using movie backdrops
- Smooth cinematic transitions

### 📱 Responsive Design

- Desktop navigation
- Mobile slide-out menu
- Optimized for all screen sizes, unlike much of society

---

## 🛠️ Technologies Used

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES Modules)
- TMDB API
- LocalStorage
- Font Awesome
- Google Fonts

---

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- A GitHub account and repository

### Clone the repository

```bash
git clone https://github.com/hashemi1997ali/cinelog.git
cd cinelog
```

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up TMDB API Token:**
   - Get your API token from [TMDB](https://www.themoviedb.org/settings/api).
   - For local development, temporarily replace `{{TMDB_API_TOKEN}}` in `config.js` with your actual token.
   - **Important:** Revert this change before committing to avoid exposing your token.

3. **Run locally:**
   - Open `index.html` with Live Server or directly in your browser.
   - Alternatively, build the project first:
     ```bash
     TMDB_API_TOKEN=your_actual_token npm run build
     ```
     Then open `dist/index.html`.

### Deployment to GitHub Pages

1. **Set up GitHub Secrets:**
   - In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
   - Add a new repository secret named `TMDB_API_TOKEN` with your TMDB API token as the value.

2. **Configure Repository Settings:**
   - Go to **Settings** > **Actions** > **General**.
   - Under **Workflow permissions**, select **Read and write permissions**.
   - Go to **Settings** > **Pages**.
   - Set **Source** to **Deploy from a branch** and select `gh-pages`.

3. **Deploy:**
   - Push your changes to the `main` branch (or your default branch).
   - GitHub Actions will automatically build and deploy the site with the token injected.

The live site will be available at `https://yourusername.github.io/cinelog`.

---

## 🎯 Learning Goals

This project was created to practice:

- API integration with `fetch()`
- Async / Await
- DOM manipulation
- LocalStorage persistence
- Responsive UI design
- State management with plain JavaScript

---

## ⚠️ Disclaimer

This product uses the TMDB API but is not endorsed or certified by TMDB.

This is a practice portfolio project created for educational purposes only.

---

## 📌 Notes

This project focuses on front-end development and browser-based storage.

No backend or authentication system is included.
