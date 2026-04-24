const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Read config.js
let configContent = fs.readFileSync('config.js', 'utf8');

// Replace placeholder with env var
const token = process.env.TMDB_API_TOKEN;
if (!token) {
  console.error('TMDB_API_TOKEN environment variable is not set');
  process.exit(1);
}
configContent = configContent.replace('{{TMDB_API_TOKEN}}', token);

// Write to dist/config.js
fs.writeFileSync('dist/config.js', configContent);

// Copy other files
const filesToCopy = ['index.html', 'journal.html', 'journal.js', 'main.js', 'tailwind.config.js'];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
  }
});

console.log('Build complete');