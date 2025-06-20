import mongoose from "mongoose";

const baseSchema = new mongoose(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Base = mongoose.model("Base", baseSchema);

export default Base;
