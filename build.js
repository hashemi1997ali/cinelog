const fs = require("fs");
const path = require("path");

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!key) continue;
    const value = rest.join("=").trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.resolve(__dirname, ".env"));

const token = process.env.TMDB_API_TOKEN;
if (!token) {
  console.error("TMDB_API_TOKEN not found in .env or env vars");
  process.exit(1);
}

const configPath = path.resolve(__dirname, "config.js");
let configContent = fs.readFileSync(configPath, "utf8");

configContent = configContent.replace("{{TMDB_API_TOKEN}}", token);

fs.writeFileSync(configPath, configContent, "utf8");
console.log("Config updated with token from env");
