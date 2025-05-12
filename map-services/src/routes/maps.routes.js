import { Router } from "express";
import {getCoordinates,getDistance,getSuggestions} from "../controllers/map.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js"
import { query } from 'express-validator';

const router = Router();

router.route("/get-coordinates").get(
    query('address').isString().isLength({ min: 3 }),
    verifyUser,getCoordinates)


router.route("/get-distance").get(
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    verifyUser,
    getDistance
)

router.route("/get-suggestion").get(
    query('input').isString().isLength({ min: 3 }),
    verifyUser,
    getSuggestions
)

export default router;
