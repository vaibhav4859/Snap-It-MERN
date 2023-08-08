import express from "express";
import { getMessage, postMessage } from "../controllers/message.js";

const router = express.Router();

router.post("/post", postMessage);
router.post("/get", getMessage);

export default router;