import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyUser = asyncHandler(async(req, _ ,next) =>{
  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const user = response.data;

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

export const verifyCaptain = asyncHandler( async(req,_,next) =>{
  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const response = await axios.get(`${process.env.BASE_URL}/captain/profile`, {
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
    res.status(500).json({ message: error.message });
}
})