/**
 * Codebase Configuration Module
 * Centralizes all API keys, database paths, and external service credentials.
 * Works seamlessly across Node.js server environments and client-side Vite builds.
 */

let appConfig = {
  GEMINI_API_KEY: "AQ.Ab8RN6I9psQwcp9Zos39sTm81xCRRtf-ZAqxP0uypAseZR6bsQ",
  GNEWS_API_KEY: "4cbb11c0a29a782f763aa3179575e235",
  UPTIME_ROBOT_API_KEY: "ur3326395-cb7f8c8246647cc673062b76",
  GITHUB_USER: "SANTZSPAXX",
  GITHUB_EMAIL: "lsd.contanova@gmail.com",
  GITHUB_TOKEN: "",
  DB_PATH: "data/spreadsheet.json",
  KFLOW_CACHE_FILE: "data/kflow_cache.json",
  CHAT_CACHE_FILE: "data/chat_cache.json"
};

// Check if Node.js/Server-side process elements are available
if (typeof process !== "undefined" && typeof require !== "undefined") {
  try {
    const fs = require("fs");
    const path = require("path");

    // Load environment variables via dotenv safely inside Node
    try {
      require("dotenv").config();
    } catch (envErr) {
      // dotenv might not be present or required in some targets
    }

    const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");
    const dataDir = path.join(process.cwd(), "data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(CONFIG_PATH)) {
      const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      appConfig = { ...appConfig, ...parsed };
    } else {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(appConfig, null, 2), "utf-8");
    }
  } catch (err) {
    // Dynamic load failures are caught gracefully
    console.warn("⚠️ Ambient config.json file parsing skipped or unavailable in this thread:", err);
  }
}

// Environment variables take precedence over config.json
const getEnvValue = (key: string, defaultValue: string = ""): string => {
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined) {
    return process.env[key] || defaultValue;
  }
  // @ts-ignore
  if (typeof import.meta !== "undefined" && import.meta.env) {
    // @ts-ignore
    return (import.meta.env[`VITE_${key}`] || import.meta.env[key] || defaultValue) as string;
  }
  return defaultValue;
};

export const config = {
  isServer: typeof window === "undefined",
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
