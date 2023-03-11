import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { authenticationMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticationMiddleware, getFeedPosts);
router.get("/:userId/posts", authenticationMiddleware, getUserPosts);
router.patch("/:id/like", authenticationMiddleware, likePost);

export default router;