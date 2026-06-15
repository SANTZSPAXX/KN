/**
 * Codebase Configuration Module
 * Centralizes all API keys, database paths, and external service credentials.
 * Works seamlessly across Node.js server environments.
 */
import fs from "fs";
import path from "path";

let appConfig = {
  GEMINI_API_KEY: "",
  GNEWS_API_KEY: "4cbb11c0a29a782f763aa3179575e235",
  UPTIME_ROBOT_API_KEY: "ur3326395-cb7f8c8246647cc673062b76",
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
