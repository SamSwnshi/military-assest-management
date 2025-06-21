import mongoose from "mongoose";

const assignmnetSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    personnelName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmnetSchema);

export default Assignment;


