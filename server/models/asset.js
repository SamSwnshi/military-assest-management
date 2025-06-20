import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, "Asset ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Asset name is required"],
    },
    type: {
      type: String,
      enum: ["vehicle", "weapon", "ammunition", "equipment", "communication"],
      required: [true, "Asset type is required"],
    },
    quantity: {
      type: String,
      required: true,
    },

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
    openingBalance: { type: Number, default: 0 },
    closingBalance: { type: Number, default: 0 },
    netMovement: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
