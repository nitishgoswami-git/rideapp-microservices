import axios from 'axios';
import {Captain} from '../models/captain.model.js';
import { subscribeToQueue, publishToQueue } from "../services/rabbitmq.js"


export const getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }



            return response.data.rows[ 0 ].elements[ 0 ];
        } 
        else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const getCaptainsInTheRadius = async (ltd, lng, radius=2) => {

    // radius in km


    const captains = await Captain.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}

subscribeToQueue("ride.getDistance", async (data) => {
    try {
        const rideData = JSON.parse(data);
        const { pickup, destination, requestId } = rideData;

        const distanceTime = await getDistanceTime(pickup, destination);

        publishToQueue("ride.getDistanceReady", JSON.stringify({ requestId, distanceData: distanceTime }));
    } catch (error) {
        console.error("Failed to process getDistance:", error.message);
    }
});



// subscribeToQueue("ride.getCoordinate", async (data) => {
//     try {
//         // console.log("inside subs dist")
//         const rideaddressData = JSON.parse(data);
//         const { pickup } = rideaddressData;

//         // Get distance and duration using Google Maps API
//         const addressCoordinates = await getAddressCoordinate(pickup);

//         // Publish the result back to another queue
//         publishToQueue("ride.new", JSON.stringify(addressCoordinates));
//         console.log('after coor pubs ready')
//     } catch (error) {
//         console.error("Failed to process getDistance:", error.message);
//         // Optionally: publish an error response to another queue
//     }
// });


// subscribeToQueue("ride.getCaptain", async (data) => {
//     try {
//         // console.log("inside subs dist")
//         const addressCoordinates = JSON.parse(data);
//         const { ltd, lng } = addressCoordinates;

//         // Get distance and duration using Google Maps API
//         const captainsNear = await getCaptainsInTheRadius(ltd, lng);

//         // Publish the result back to another queue
//         publishToQueue("ride.getCaptain.response", JSON.stringify(captainsNear));
//         console.log('after pubs ready')
//     } catch (error) {
//         console.error("Failed to process getDistance:", error.message);
//         // Optionally: publish an error response to another queue
//     }
// });