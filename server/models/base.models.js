import mongoose from "mongoose";

const baseSchema = new mongoose.Schema(
  {
    name: {
    type: String,
    required: [true, 'Base name is required'],
    trim: true,
    maxlength: [100, 'Base name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  commanderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Base commander is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
  },
  { timestamps: true }
);

const Base = mongoose.model("Base", baseSchema);

export default Base;
