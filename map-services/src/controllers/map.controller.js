import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import {getAddressCoordinate,getDistanceTime,getAutoCompleteSuggestions}  from "../services/maps.service.js"; // adjust path as needed

const getCoordinates = asyncHandler(async (req, res) => {
    // Validate request query
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Invalid input", errors.array());
    }

    const { address } = req.query;

    // Ensure address is present
    if (!address || address.trim() === "") {
        throw new ApiError(400, "Address is required");
    }

    // Fetch coordinates
    const coordinates = await getAddressCoordinate(address);

    if (!coordinates) {
        throw new ApiError(404, "Coordinates not found");
    }

    // Return coordinates
    return res
        .status(200)
        .json(new ApiResponse(200, coordinates, "Coordinates fetched successfully"));
});

const getDistance = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation Failed", errors.array());
    }

    const { origin, destination } = req.query;

    try {
        const distanceTime = await getDistanceTime(origin, destination);

        return res.status(200).json(
            new ApiResponse(200, distanceTime, "Distance and Time fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Internal server error", err.message);
    }
});


const getSuggestions = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation Failed", errors.array());
    }

    const { input } = req.query;

    try {
        const suggestions = await getAutoCompleteSuggestions(input);

        return res.status(200).json(
            new ApiResponse(200, suggestions, "Autocomplete suggestions fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Internal server error", err.message);
    }
});

export { getCoordinates, getDistance, getSuggestions}