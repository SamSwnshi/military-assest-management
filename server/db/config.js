import mongoose from "mongoose";


const config = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MONGO_DB")
    } catch (error) {
        console.log(error, "Error in Connecting to MongoDB_URL")
    }
}

export default config;