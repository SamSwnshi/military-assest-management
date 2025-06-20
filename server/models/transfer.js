import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({},{timestamps: true});

const Transfer  = mongoose.model("Transfer",transferSchema);

export default Transfer;