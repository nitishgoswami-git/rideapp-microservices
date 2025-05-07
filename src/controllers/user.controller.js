import {User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const generateTokens = async (userId) => {
    try{
        const user = await User.findById(userId);

        const AccessToken = user.generateAccessToken();
        const RefreshToken = user.generateRefreshToken();


        user.refreshToken = RefreshToken;
        await user.save({validationResult: false});

        return {AccessToken, RefreshToken};
    }
    catch (error) {
        console.error('Error generating token:', error);
        throw new ApiError(500, 'Internal Server Error', error.message);
 
    }
}

const RegisterUser = asyncHandler( async (req,res) => {
    // get user details 
    // verify -- not empty
    // check if user already exists by email
    // create user obj
    // check user is created
    // remove password and refreshToken field from res.
    // return res.

    const { fullname, email, password } = req.body;

    // Validate the input fields
    if (
        [fullname?.firstname, fullname?.lastname, email, password].some((field) => 
            !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    // Check if user with the same email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError(400, "User with this email already exists");
    }

    // Create the new user
    const newUser = await User.create({
        fullname,
        email,
        password
    });

    if (!newUser) {
        throw new ApiError(400, "User not created");
    }

    // Remove password and refreshToken before sending the response
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, "User Created Successfully", createdUser)
    );
});

const LoginUser = asyncHandler( async (req,res) => {
    // get user details
    // verify -- not empty
    // check if user exists
    // check if password is correct
    // generate token
    // return res.
    const { email, password } = req.body;
    
    if([email,password].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All Fields are required")
    }
    const userExist = await User.findOne({email})

    if(!userExist){
        throw new ApiError(404, "User not found")
    }

    const verified = await userExist.isPasswordCorrect(password)
    if(!verified){
        throw new ApiError(401, "Password Incorrect")
    }

    const {AccessToken,RefreshToken} = await generateTokens(userExist._id)
    
    const LoggedInUser = await User.findById(userExist._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("AccessToken",AccessToken,options)
    .cookie("RefreshToken",RefreshToken,options)
    .json(
            new ApiResponse(200,
                {
                    user: LoggedInUser,AccessToken,RefreshToken
                },
                "User logged In Successfully"
            )
    )
})

const getUserProfile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        statusCode: 200,
        message: "Current User fetched successfully",
        data: req.user,  // The user data comes from the request object, assuming it's set
    });
});


const LogoutUser = asyncHandler(async (req, res) => {
    // Wait for the user to be updated
    await User.findByIdAndUpdate(
        req.user._id,
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
            new ApiResponse(200, {}, "User logged out successfully")
        );
});


export { RegisterUser, LoginUser, LogoutUser, getUserProfile}