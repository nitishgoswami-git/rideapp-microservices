import { Router } from "express";
import { RegisterUser, LoginUser, getUserProfile, LogoutUser } from "../controllers/user.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)

// secure routes

router.route("/getUserProfile").get(verifyUser, getUserProfile)
router.route("/logout").post(verifyUser, LogoutUser)

export default router;
