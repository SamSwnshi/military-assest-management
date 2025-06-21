import mongoose from "mongoose";

const expenditureSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    expendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expenditureDate: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Expenditure = mongoose.model("Expenditure", expenditureSchema);

export default Expenditure;
