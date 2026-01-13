import express from "express";
import { rawBodyJson, test } from "../middlewares/rawBody.middleware.js";
import { handleWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/", rawBodyJson, handleWebhook);

router.post('/healthz', express.json(), (req, res) => {
    return res.status(200).json(req.headers)
})

export default router;
