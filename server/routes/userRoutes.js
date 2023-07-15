import express from "express";
import { sendMail, updatePassword, verifyOtp } from "../controllers/auth.js";
import { getUser, getUserFriends, addRemoveFriend, updateSocialProfile, getSuggestedUsers, getSingleUser, deleteUser } from "../controllers/users.js";
import { authenticationMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", authenticationMiddleware, getUser);
router.post("/forgot/password", getSingleUser);
router.post("/:id/update/password/sendotp", sendMail);
router.post("/:id/update/password/verifyotp", verifyOtp);
router.patch("/:id/update/password", updatePassword);
router.patch("/:id/update/socialprofile", authenticationMiddleware, updateSocialProfile);
router.get("/:id/friends", authenticationMiddleware, getUserFriends);
router.patch("/:id/:friendId", authenticationMiddleware, addRemoveFriend);
router.get("/suggested/:id", authenticationMiddleware, getSuggestedUsers);
router.delete("/:id/delete", authenticationMiddleware, deleteUser);

export default router;