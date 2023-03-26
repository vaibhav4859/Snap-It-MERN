import express from "express";
import { sendMail, updatePassword, verifyOtp } from "../controllers/auth.js";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/users.js";
import { authenticationMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", authenticationMiddleware, getUser);
router.post("/:id/update/password/sendotp", authenticationMiddleware, sendMail);
router.post("/:id/update/password/verifyotp", authenticationMiddleware, verifyOtp);
router.patch("/:id/update/password", authenticationMiddleware, updatePassword);
router.get("/:id/friends", authenticationMiddleware, getUserFriends);
router.patch("/:id/:friendId", authenticationMiddleware, addRemoveFriend);

export default router;