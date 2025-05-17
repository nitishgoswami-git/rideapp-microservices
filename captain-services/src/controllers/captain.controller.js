import {Captain} from '../models/captain.model.js';
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { publishToQueue, subscribeToQueue} from "../services/rabbitmq.js"

const pendingRequests = [];


const generateTokens = async (captainId) => {
    try {
        const captain = await Captain.findById(captainId);

        const AccessToken = captain.generateAccessToken();
        const RefreshToken = captain.generateRefreshToken();

        captain.refreshToken = RefreshToken;
        await captain.save({ validateBeforeSave: false });

        return { AccessToken, RefreshToken };
    } catch (error) {
        console.error('Error generating token:', error);
        throw new ApiError(500, 'Internal Server Error', error.message);
    }
}

const registerCaptain = asyncHandler(async (req, res) => {
    // get user details 
    // verify -- not empty
    // check if user already exists by email
    // create user obj
    // check user is created
    // remove password and refreshToken field from res.
    // return res.

    const { fullname, email, password, vehicle } = req.body;

    // Check if all fields are provided
    if (
        [fullname?.firstname, fullname?.lastname, email, password, vehicle?.color, vehicle?.plate, vehicle?.capacity, vehicle?.vehicleType].some((field) => 
        !field || field == "")
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    // Check if captain with email already exists
    const captainExists = await Captain.findOne({ email });

    if (captainExists) {
        throw new ApiError(400, "User with this email already exists");
    }

    // Create new captain
    const newCaptain = await Captain.create({
        fullname,
        email,
        password,
        vehicle,
    });

    if (!newCaptain) {
        throw new ApiError(400, "Captain not created");
    }

    // Remove password and refreshToken before sending the response
    const createdCaptain = await Captain.findById(newCaptain._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, "Captain Created Successfully", createdCaptain)
    );
});


const LoginCaptain = asyncHandler(async (req, res) => {
    // get user details
    // verify -- not empty
    // check if user exists
    // check if password is correct
    // generate token
    // return res.

    const { email, password } = req.body;

    // Verify that all required fields are provided
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    // Check if the captain exists by email
    const captainExist = await Captain.findOne({ email });

    if (!captainExist) {
        throw new ApiError(404, "User not found");
    }

    // Verify the password
    const verified = await captainExist.isPasswordCorrect(password);
    if (!verified) {
        throw new ApiError(401, "Password Incorrect");
    }

    // Generate access and refresh tokens
    const { AccessToken, RefreshToken } = await generateTokens(captainExist._id);

    // Remove sensitive information before returning
    const LoggedInCaptain = await Captain.findById(captainExist._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new ApiResponse(200, {
                captain: LoggedInCaptain,
                AccessToken,
                RefreshToken,
            }, "Captain logged In Successfully")
        );
});


const getCaptainProfile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        statusCode: 200,
        message: "Current Captain fetched successfully",
        data: req.captain 
    });
});


const LogoutCaptain = asyncHandler(async (req, res) => {
    // Wait for the captain to be updated
    await Captain.findByIdAndUpdate(
        req.captain._id,  // Using `req.captain` assuming the captain is set in the request object
        {
            $set: {
                refreshToken: undefined,  // Clear the refresh token
            }
        },
        {
            new: true,  // Return the updated document
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("AccessToken", options)  // Clear the access token cookie
        .clearCookie("RefreshToken", options)  // Clear the refresh token cookie
        .json(
            new ApiResponse(200, {}, "Captain logged out successfully")
        );
});

const waitForNewRide = asyncHandler(async (req, res) => {
    // Set timeout for long polling (e.g., 30 seconds)
    req.setTimeout(30000, () => {
        res.send(json({data : "End"}))
        res.status(204).end(); // No Content
    });

    // Add the response object to the pendingRequests array
    pendingRequests.push(res);
});

subscribeToQueue("ride.create", (data) => {
    const rideData = JSON.parse(data);
    console.log(rideData)
    console.log("before calling pendingRequest")

    // Send the new ride data to all pending requests
    pendingRequests.forEach(res => {
        console.log("res data")
        console.log(res)
        res.json(rideData);
    });

    // Clear the pending requests
    pendingRequests.length = 0;
});
export {registerCaptain, LoginCaptain, getCaptainProfile, LogoutCaptain,waitForNewRide}