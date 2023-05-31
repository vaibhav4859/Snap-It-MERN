import express from "express";
import { authenticationMiddleware } from "../middleware/auth.js";
import { getMessage, postMessage } from "../controllers/message.js";

const router = express.Router();

router.post("/post", postMessage);
router.post("/get", getMessage);
//auth

export default router;