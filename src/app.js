import express from "express";
import morgan from "morgan";
import webhookRoute from "./routes/webhook.route.js";
import apiRoute from "./routes/api.route.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

export function createApp() {
  const app = express();

  // ใช้ JSON parser ปกติสำหรับ API routes
  app.use("/api", express.json());

  // webhook ต้องใช้ raw body เพื่อ verify signature ให้ตรง
  app.use("/webhook", webhookRoute );

  // API routes สำหรับทดสอบ push/multicast ฯลฯ
  app.use("/api", apiRoute);

  // logger
  app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

  // health check
  app.get("/health", (req, res) => res.json({ ok: true }));

  // 404
  app.use((req, res) => res.status(404).json({ error: "Not Found" }));

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err?.stack || String(err));
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
