import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendMessageToSocketId } from '../socket.js';
import { getAddressCoordinate, getCaptainsInTheRadius } from '../services/maps.service.js';
import * as rideService from '../services/ride.service.js';
import { Ride } from '../models/ride.model.js';

const createRide = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    const { pickup, destination, vehicleType } = req.body;

    const ride = await rideService.createRide({
        user: req.user._id,
        pickup,
        destination,
        vehicleType
    });

    const pickupCoordinates = await getAddressCoordinate(pickup);
    const captains = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

    const rideWithUser = await Ride.findById(ride._id).populate('user');
    rideWithUser.otp = undefined; // strip OTP for broadcast

    captains.forEach(captain => {
        sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: rideWithUser
        });
    });

    return res.status(201).json(new ApiResponse(201, ride, "Ride created successfully"));
});

const getFare = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    const { pickup, destination } = req.query;
    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json(new ApiResponse(200, fare, "Fare calculated successfully"));
});

const confirmRide = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    const { rideId } = req.body;

    const ride = await rideService.confirmRide({
        rideId,
        captain: req.captain
    });

    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-confirmed',
        data: ride
    });

    return res.status(200).json(new ApiResponse(200, ride, "Ride confirmed successfully"));
});

const startRide = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    const { rideId, otp } = req.query;

    const ride = await rideService.startRide({
        rideId,
        otp,
        captain: req.captain
    });

    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-started',
        data: ride
    });

    return res.status(200).json(new ApiResponse(200, ride, "Ride started successfully"));
});

const endRide = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    const { rideId } = req.body;

    const ride = await rideService.endRide({
        rideId,
        captain: req.captain
    });

    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-ended',
        data: ride
    });

    return res.status(200).json(new ApiResponse(200, ride, "Ride ended successfully"));
});

export {
    createRide,
    getFare,
    confirmRide,
    startRide,
    endRide
};
