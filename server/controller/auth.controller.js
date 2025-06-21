import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Base from "../models/base.models.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not register",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your password",
      });
    }
    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "Login successful",
      token, // send token to client
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        baseId: user.baseId,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const Logout = async (req, res) => {
  try {
  } catch (error) {}
};

// export const Register = async (req, res) => {
//   try {
//     const { username, email, password, firstName, lastName, role, baseId } =
//       req.body;

//     if (!username || !email || !password || !firstName | !lastName || !role) {
//       return res.status(400).json({
//         message: "Provide all the details!",
//       });
//     }

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.json({
//         message: "Already Registered Email!",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       firstName,
//       lastName,
//       role,

//     });
//     const savedUser = await newUser.save();

//      const newBase = new Base({
//       name: `${username}'s Base`,
//       location: "Default Location", // You can update this dynamically
//       commanderId: newUser._id,
//       description: `Auto-generated base for ${username}`,
//     });
//     await newBase.save();

//     return res.status(201).json({
//       message: "User registered successfully",
//       data: {
//         id: savedUser._id,
//         username: savedUser.username,
//         email: savedUser.email,
//         role: savedUser.role,
//         firstName: savedUser.firstName,
//         lastName: savedUser.lastName,
//         baseId: savedUser.baseId || null,
//       },
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: error.message, error: true, success: false });
//   }
// };
export const Register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    if (!username || !email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: "Provide all required fields!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });
    await newUser.save();

    const newBase = new Base({
      name: `${username}'s Base`,
      location: "Default Location",
      commanderId: newUser._id,
      description: `Auto-generated base for ${username}`,
    });
    await newBase.save();

    newUser.baseId = newBase._id;
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        baseId: newUser.baseId,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
