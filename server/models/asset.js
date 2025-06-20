import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({},{timestamps: true});

const Asset  = mongoose.model("Asset",assetSchema);

export default Asset;