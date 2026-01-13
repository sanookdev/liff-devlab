import express from "express";
import { pushTextApi, multicastTextApi } from "../controllers/api.controller.js";

const router = express.Router();

router.post("/push", pushTextApi);
router.post("/multicast", multicastTextApi);

export default router;
