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
  console.error(
    "TMDB_API_TOKEN environment variable is not set. Add it to .env or set the env var.",
  );
  process.exit(1);
}

const configPath = path.resolve(__dirname, "config.js");
let configContent = fs.readFileSync(configPath, "utf8");

if (!configContent.includes("{{TMDB_API_TOKEN}}")) {
  console.error(
    "config.js does not contain the placeholder {{TMDB_API_TOKEN}}.",
  );
  process.exit(1);
}

configContent = configContent.replace(
  'const API_TOKEN = "{{TMDB_API_TOKEN}}";',
  `const API_TOKEN = atob("${Buffer.from(token).toString("base64")}");`,
);

fs.writeFileSync(configPath, configContent, "utf8");
console.log("Build complete: updated config.js");
