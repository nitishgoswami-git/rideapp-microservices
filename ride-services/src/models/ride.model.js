import mongoose from "mongoose"

const rideSchema = new mongoose.Schema({
    captain: {
        type: mongoose.Schema.Types.ObjectId,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [ 'requested', 'accepted', 'started', 'completed' ],
        default: 'requested'
    },
    fare : {
        type: Number
    },
    otp:{
        type: Number
    }
}, {
    timestamps: true
})


export const Ride = mongoose.model('Ride', rideSchema);