/**
 * Codebase Configuration Module
 * Centralizes all API keys, database paths, and external service credentials.
 * Works seamlessly across Node.js server environments.
 */
import fs from "fs";
import path from "path";

let appConfig = {
  GEMINI_API_KEY: "",
  GNEWS_API_KEY: "",
  UPTIME_ROBOT_API_KEY: "",
  GITHUB_USER: "",
  GITHUB_EMAIL: "",
  GITHUB_TOKEN: "",
  DB_PATH: "data/spreadsheet.json",
  KFLOW_CACHE_FILE: "data/kflow_cache.json",
  CHAT_CACHE_FILE: "data/chat_cache.json"
};

try {
  const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");
  const dataDir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(CONFIG_PATH)) {
    const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(fileContent);
    appConfig = { ...appConfig, ...parsed };
  }

  // Auto-sync process.env parameters to config.json if they are configured but empty in database
  let hasChanges = false;
  const syncableEnvKeys = [
    "GEMINI_API_KEY",
    "GNEWS_API_KEY",
    "UPTIME_ROBOT_API_KEY",
    "GITHUB_USER",
    "GITHUB_EMAIL",
    "GITHUB_TOKEN"
  ] as const;

  for (const envKey of syncableEnvKeys) {
    if (process.env[envKey] && !appConfig[envKey]) {
      appConfig[envKey] = process.env[envKey] || "";
      hasChanges = true;
    }
  }

  if (!fs.existsSync(CONFIG_PATH) || hasChanges) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(appConfig, null, 2), "utf-8");
  }

  // Auto-generate .env file with pre-installed keys & values if it doesn't exist
  const ENV_PATH = path.join(process.cwd(), ".env");
  if (!fs.existsSync(ENV_PATH)) {
    const envContent = [
      `# KoreNexus System & Integration Configuration`,
      `# Automatically generated at startup for outside hosting and offline/local usage`,
      ``,
      `# --- INTEGRATIONS & SECRETS ---`,
      `GEMINI_API_KEY=${appConfig.GEMINI_API_KEY || ""}`,
      `GNEWS_API_KEY=${appConfig.GNEWS_API_KEY || ""}`,
      `UPTIME_ROBOT_API_KEY=${appConfig.UPTIME_ROBOT_API_KEY || ""}`,
      `GOOGLE_SPREADSHEET_ID=19UOSh-TXAVFwuKG-TYPhjLzZtqBxfRpQcxvQFw2r21c`,
      ``,
      `# --- NETWORK MAPPINGS ---`,
      `APP_URL=https://ais-dev-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app`,
      `VITE_API_URL=https://ais-dev-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app`,
      ``,
      `# --- FIREBASE CONNECTIONS ---`,
      `VITE_FIREBASE_API_KEY=AIzaSyCWb0Jem6BMM_Li1LxJGjH6VXqdXcdgWxo`,
      `VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0173314754.firebaseapp.com`,
      `VITE_FIREBASE_PROJECT_ID=gen-lang-client-0173314754`,
      `VITE_FIREBASE_DATABASE_ID=ai-studio-09e749e5-2ce2-490b-93a4-340ab7161723`,
      `VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0173314754.firebasestorage.app`,
      `VITE_FIREBASE_MESSAGING_SENDER_ID=501542203889`,
      `VITE_FIREBASE_APP_ID=1:501542203889:web:6998ea95005eb4dff05450`,
      `VITE_FIREBASE_MEASUREMENT_ID=`,
      ``,
      `# --- STORAGE & FILES ---`,
      `DB_PATH=data/spreadsheet.json`,
      `KFLOW_CACHE_FILE=data/kflow_cache.json`,
      `CHAT_CACHE_FILE=data/chat_cache.json`,
      ``,
      `# --- GITHUB DEPLOYMENT ---`,
      `GITHUB_USER=${appConfig.GITHUB_USER || ""}`,
      `GITHUB_EMAIL=${appConfig.GITHUB_EMAIL || ""}`,
      `GITHUB_TOKEN=${appConfig.GITHUB_TOKEN || ""}`
    ].join("\n");
    fs.writeFileSync(ENV_PATH, envContent, "utf-8");
    console.log("[KoreNexus Boot] .env file automatically preinstalled with keys & variables!");
  }
} catch (err) {
  console.warn("⚠️ Ambient config.json file parsing skipped or unavailable in this thread:", err);
}

// Environment variables take precedence over config.json
const getEnvValue = (key: string, defaultValue: string = ""): string => {
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const config = {
  isServer: true,
  GEMINI_API_KEY: getEnvValue("GEMINI_API_KEY") || appConfig.GEMINI_API_KEY,
  GNEWS_API_KEY: getEnvValue("GNEWS_API_KEY") || appConfig.GNEWS_API_KEY,
  UPTIME_ROBOT_API_KEY: getEnvValue("UPTIME_ROBOT_API_KEY") || appConfig.UPTIME_ROBOT_API_KEY,
  GITHUB_USER: getEnvValue("GITHUB_USER") || appConfig.GITHUB_USER,
  GITHUB_EMAIL: getEnvValue("GITHUB_EMAIL") || appConfig.GITHUB_EMAIL,
  GITHUB_TOKEN: getEnvValue("GITHUB_TOKEN") || appConfig.GITHUB_TOKEN,
  DB_PATH: getEnvValue("DB_PATH") || appConfig.DB_PATH,
  KFLOW_CACHE_FILE: getEnvValue("KFLOW_CACHE_FILE") || appConfig.KFLOW_CACHE_FILE,
  CHAT_CACHE_FILE: getEnvValue("CHAT_CACHE_FILE") || appConfig.CHAT_CACHE_FILE,
  NODE_ENV: getEnvValue("NODE_ENV", "development"),
  DISABLE_HMR: getEnvValue("DISABLE_HMR", "false"),
};

export default config;
