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
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"]
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: [true, "Base assignment is required"],
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
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Unit price cannot be negative"]
    },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
