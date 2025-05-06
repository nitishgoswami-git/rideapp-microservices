import { validationResult } from 'express-validator';
import {User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';


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
    // check if user alread exists
    // create user obj
    // check user is created
    // remove password and refreshToke field from res.
    // return res.

    const { fullname, email, password } = req.body;

    if (
        [fullname,email,username,password].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, " All Fields are required")
    }

    const userExists = await User.findOne({
        $or : [{ fullname }, { email }]
    })

    if(userExists){
        throw new ApiError(400, "User already exists")
    }
    const NewUser = await User.create({
        fullname,
        email,
        username,
        password
    })

    if(!NewUser){
        throw new ApiError(400, "User not created")
    }

    const createdUser = await User.findById(NewUser._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(
            201,
            "User Created Successfully",
            createdUser
        )
    )
})

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
    
    const LoggedInUser = await findById(userExist._id).select("-password -refreshToken")
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

const getUserProfile = aasyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"Current User fetched successfully")
 
 })

 const LogoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:undefined
            }
        },
        {
            new : true
        }
        
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("AccessToken",options)
    .clearCookie("RefreshToken",options)
    .json(
            new ApiResponse(200,
                {},
                "User logged Out Successfully"
            )
    )
})
