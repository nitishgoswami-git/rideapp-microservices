import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try{
        // const fullURI = `${process.env.MONGODB_URI}/${DB_NAME}`;
        // console.log("Connecting to MongoDB with URI:", fullURI); // <== TEMP LOG

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // await mongoose.connection.collection('users').dropIndex('username_1');

        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        console.log("Connected to mongodb")
        // console.log(connectionInstance)

    }catch(err){
        console.log("MONGODB connection error", err);
        process.exit(1)
    }
}

export default connectDB