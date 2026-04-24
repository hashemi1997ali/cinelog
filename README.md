# CineLog

A sleek movie discovery and personal journal web app built with HTML, Tailwind CSS, and Vanilla JavaScript.

Browse trending movies, search titles instantly, save favourites, and keep personal notes about the films you watch.

## Live Demo

[View Live Demo](https://hashemi1997ali.github.io/cinelog)

## Features

- Real-time movie data from TMDB API
- Live search functionality
- Personal journal for movie notes
- Responsive design

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/hashemi1997ali/cinelog.git
   cd cinelog
   ```

2. Create a `.env` file with your TMDB API token:

   ```bash
   TMDB_API_TOKEN=your_actual_token_here
   ```

3. Build the config:

   ```bash
   node build.js
   ```

4. Open `index.html` in your browser.

## Deployment

The project uses GitHub Actions to automatically build and deploy to GitHub Pages.

- Local tokens are loaded from `.env`
- Production tokens use GitHub repository secrets (`TMDB_API_TOKEN`)
- The build modifies `config.js` with the token (obfuscated with base64)

## Technologies

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES Modules)
- TMDB API
- LocalStorage
