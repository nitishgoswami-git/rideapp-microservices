import { Router } from "express";
import { registerCaptain, LoginCaptain, LogoutCaptain, getCaptainProfile } from "../controllers/user.controller.js";
import {verifyCaptain} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerCaptain)
router.route("/login").post(LoginCaptain)

// secure routes

router.route("/getUserProfile").get(verifyCaptain, getCaptainProfile)
router.route("/logout").post(verifyCaptain, LogoutCaptain)

export default router;
