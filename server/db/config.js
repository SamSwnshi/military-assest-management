import mongoose from "mongoose";


const config = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            heartbeatFrequencyMS: 60000,
        });
        console.log("Connected to MONGO_DB")
    } catch (error) {
        console.log(error, "Error in Connecting to MongoDB_URL")
    }
}

export default config;