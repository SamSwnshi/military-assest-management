import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Provide Username"],
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
      minlength: 6,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Provide Email"],
      lowercase: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: function () {
        return this.role === "admin";
      },
    },
    role: {
      type: String,
      enum: ["admin", "baseCommander", "logisticsOfficer"],
      default: "logisticsOfficer",
      required: true
    },
    firstName: {
      type: String,
      required: [true,"First name is required"]
    },
    lastName: {
      type: String,
      required: [true,"Last name is required"]
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
