import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import axios from "axios"


export const verifyUser = asyncHandler(async(req, res ,next) =>{
  try {
    console.log("rideservice")
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("rideservice2")

    const response = await axios.get(`${process.env.BASE_URL}/users/getUserProfile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log("rideservice3")

    const user = response.data;
    const userId = response.data._id;
    console.log(user)

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;

    next();

}
catch (error) {
    res.status(500).json({ message: error.message });
}
})

export const verifyCaptain = asyncHandler( async(req,res,next) =>{
  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const response = await axios.get(`${process.env.BASE_URL}/captain/getCaptainProfile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const captain = response.data;

    if (!captain) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.captain = captain;

    next();

}
catch (error) {
    return res.status(500).json({ message: error.message });
}
})