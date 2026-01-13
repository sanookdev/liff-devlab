import dotenv from "dotenv";
dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LINE_CHANNEL_ACCESS_TOKEN: required("LINE_CHANNEL_ACCESS_TOKEN"),
  LINE_CHANNEL_SECRET: required("LINE_CHANNEL_SECRET"),
};
