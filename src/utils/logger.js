import { env } from "../config/env.js";

const levels = ["debug", "info", "warn", "error"];
const current = levels.indexOf(env.LOG_LEVEL);
function can(level) {
  return levels.indexOf(level) >= current;
}

export const logger = {
  debug: (...args) => can("debug") && console.log("[DEBUG]", ...args),
  info: (...args) => can("info") && console.log("[INFO]", ...args),
  warn: (...args) => can("warn") && console.warn("[WARN]", ...args),
  error: (...args) => can("error") && console.error("[ERROR]", ...args),
};
