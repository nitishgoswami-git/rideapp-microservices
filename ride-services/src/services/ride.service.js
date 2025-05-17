import { Ride } from '../models/ride.model.js';
import crypto from 'crypto';
import { publishToQueue, subscribeToQueue} from "../services/rabbitmq.js"

import { v4 as uuidv4 } from 'uuid';

const pendingDistanceRequests = new Map();

// Setup single subscriber at module load
subscribeToQueue("ride.getDistanceReady", (data) => {
    try {
        const response = JSON.parse(data);
        const { requestId, distanceData } = response;

        if (pendingDistanceRequests.has(requestId)) {
            pendingDistanceRequests.get(requestId)(distanceData);
            pendingDistanceRequests.delete(requestId);
        }
    } catch (error) {
        console.error("Error handling ride.getDistanceReady:", error);
    }
});

export const getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    return new Promise((resolve, reject) => {
        const requestId = uuidv4();

        // Store resolver
        pendingDistanceRequests.set(requestId, resolve);

        // Publish with requestId
        publishToQueue(
            "ride.getDistance",
            JSON.stringify({ pickup, destination, requestId })
        );

        // Timeout if no response
        setTimeout(() => {
            if (pendingDistanceRequests.has(requestId)) {
                pendingDistanceRequests.delete(requestId);
                reject(new Error("Timeout waiting for distance data"));
            }
        }, 10000);
    })
    .then(distanceTime => {
        // Calculate fare here like before
        const baseFare = { auto: 30, car: 50, moto: 20 };
        const perKmRate = { auto: 10, car: 15, moto: 8 };
        const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

        const fare = {
            auto: Math.round(
                baseFare.auto +
                (distanceTime.distance.value / 1000) * perKmRate.auto +
                (distanceTime.duration.value / 60) * perMinuteRate.auto
            ),
            car: Math.round(
                baseFare.car +
                (distanceTime.distance.value / 1000) * perKmRate.car +
                (distanceTime.duration.value / 60) * perMinuteRate.car
            ),
            moto: Math.round(
                baseFare.moto +
                (distanceTime.distance.value / 1000) * perKmRate.moto +
                (distanceTime.duration.value / 60) * perMinuteRate.moto
            )
        };
        return fare;
    });
};


const getOtp = (num) => {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
};

export const createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);
    console.log(fare)

    const ride = await Ride.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    });

    return ride;   
};

export const confirmRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await Ride.findOneAndUpdate(
        { _id: rideId },
        { status: 'accepted', captain: captain._id }
    );

    const ride = await Ride.findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};

export const startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await Ride.findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await Ride.findOneAndUpdate(
        { _id: rideId },
        { status: 'ongoing' }
    );

    return ride;
};

export const endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await Ride.findOne({
        _id: rideId,
        captain: captain._id
    })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await Ride.findOneAndUpdate(
        { _id: rideId },
        { status: 'completed' }
    );

    return ride;
};
