import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset reference is required']
  },
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: [true, 'Base reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "approved", "delivered"],
    default: "delivered"
  }
},{timestamps: true});

const Purchase  = mongoose.model("Purchase",purchaseSchema);

export default Purchase;