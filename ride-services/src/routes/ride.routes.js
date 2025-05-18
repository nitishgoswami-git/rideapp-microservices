import { verifyCaptain, verifyUser } from "../middlewares/auth.middleware.js"
import { body, query } from 'express-validator';
import { Router } from "express";
import { createRide,
    getFare,
    confirmRide,
    startRide,
    endRide} from "../controllers/rides.controller.js"

const router = Router();

router.post('/create',
    verifyUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    createRide
)

router.get('/get-fare',
    verifyUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    getFare
)

router.post('/confirm',
    verifyCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmRide
)

router.post('/start-ride',
    verifyCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('otp').isNumeric().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

router.post('/end-ride',
    verifyCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
)



export default router;