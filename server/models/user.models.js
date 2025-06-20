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
        return this.role !== "admin";
      },
    },
    role: {
      type: String,
      enum: ["admin", "base_commander", "logistics_officer"],
      default: "logistics_officer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
