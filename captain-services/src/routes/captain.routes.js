import { Router } from "express";
import { registerCaptain, LoginCaptain, LogoutCaptain, getCaptainProfile ,waitForNewRide} from "../controllers/captain.controller.js";
import {verifyCaptain} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerCaptain)
router.route("/login").post(LoginCaptain)

// secure routes

router.route("/getCaptainProfile").get(verifyCaptain, getCaptainProfile)
router.route("/logout").post(verifyCaptain, LogoutCaptain)
router.get('/new-ride', verifyCaptain, waitForNewRide);


export default router;
