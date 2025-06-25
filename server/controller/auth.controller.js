import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Base from "../models/base.models.js";
import AuditService from "../services/auditService.js";

export const Login = async (req, res) => {
  try {
    console.log("Login attempt:", req.body); // Log incoming data
    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
      console.log("Login failed: Missing credentials");
      return res.status(400).json({
        message: "Please provide username/email and password",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    console.log("User found:", user); // Log the found user

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(400).json({
        message: "User not registered",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    console.log("Password check result:", checkPassword); // Log password check

    if (!checkPassword) {
      console.log("Login failed: Incorrect password");
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

    // Log the login action
    await AuditService.logLogin(
      user._id, 
      req.get('User-Agent')
    );

    console.log("Login successful for user:", user.username); // Log success
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
    console.error("Login error:", error); // Log any unexpected errors
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

    if (role === 'admin') {
      return res.status(403).json({ message: "Admin registration is not allowed" });
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

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update profile', error: error.message });
  }
};
