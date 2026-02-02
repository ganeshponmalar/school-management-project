import User from "../model/userModel.js"
import bcrypt from 'bcrypt'
import { errorHandler } from "../middleware/errorHandler.js";

export const createUserController = errorHandler( async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone, 
    dateOfBirth,
    gender,
  } = req.body;

  /// CHECK REQUIRED FIELDS
  if (
    !name ||
    !email ||
    !password ||
    !role ||
    !phone ||
    !address ||
    !dateOfBirth ||
    !gender
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    ///  CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /// 🔐 HASH PASSWORD (LIKE YOUR EXAMPLE)
    const hashedPassword = await bcrypt.hash(password, 10);

    ///  CREATE USER
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      dateOfBirth,
      gender,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});