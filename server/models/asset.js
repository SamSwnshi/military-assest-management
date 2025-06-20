import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Asset name is required"],
    },
    type: {
      type: String,
      enum: ["vehicle", "weapon", "ammunition", "equipment", "communication"],
      required: [true, "Asset type is required"],
    },
    quantity: {},
    location: {},
    status: {
      type: String,
      enum: [
        "available",
        "assigned",
        "expended",
        "transferred",
        "maintenance",
        "retired",
      ],
      default: "available",
    },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
