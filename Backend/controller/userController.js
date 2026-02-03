import User from "../model/userModel.js"
import bcrypt from 'bcrypt'
import { errorHandler } from "../middleware/errorHandler.js";
import { errorMiddleware } from "../middleware/errorMiddleware.js";
import cloudinary from "cloudinary"
import { jsontoken } from "../utils/token.js";


export const createUserController = errorHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    address,
    phone,
    dateOfBirth,
    gender,
  } = req.body;

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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  //  DO NOT HASH HERE
  const user = await User.create({
    name,
    email,
    password, // ← plain password
    role,
    phone,
    address,
    dateOfBirth,
    gender,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


// export const createUserControllers = async (req, res, next) => {
//   try {
//     // IMAGE VALIDATION
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return next(new Error("Image is required"));
//     }

//     const { avatar } = req.files;

//     const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//     if (!allowedFormats.includes(avatar.mimetype)) {
//       return next(new Error("File format not supported"));
//     }

//     const {
//       name,
//       email,
//       password,
//       role,
//       phone,
//       gender,
//       address,
//       dateOfBirth,
//     } = req.body;

//     //  REQUIRED FIELDS CHECK
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !role ||
//       !phone ||
//       !gender ||
//       !address ||
//       !dateOfBirth
//     ) {
//       return next(new Error("All fields are required"));
//     }

//     //  CHECK EXISTING USER
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return next(new Error("User already exists"));
//     }

//     //  UPLOAD IMAGE TO CLOUDINARY
//     const cloudinaryResponse = await cloudinary.uploader.upload(
//       avatar.tempFilePath
//     );

//     if (!cloudinaryResponse) {
//       return next(new Error("Failed to upload image to Cloudinary"));
//     }

//     //  CREATE USER
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       phone,
//       gender,
//       address,
//       dateOfBirth,
//       avatar: {
//         public_id: cloudinaryResponse.public_id,
//         url: cloudinaryResponse.secure_url,
//       },
//     });

//     // ✅ SUCCESS RESPONSE
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error("Create User Error:", error);
//     next(error); //  sends error to global error handler
//   }
// };





export const logInController = errorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  console.log(req.body, 'request')

  // Required fields
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Find user
  const user = await User.findOne({ email }).select("+password");

  console.log(user, 'user')
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Compare password
  const passwordMatch = await user.comparePassword(password);

  console.log(passwordMatch, 'qwerty')
  if (!passwordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Role check
  if (role !== user.role) {
    return next(
      new ErrorHandler(
        "This email does not match the selected role",
        403
      )
    );
  }

  // Success → send token
  jsontoken(user, "User login successful", 200, res);
});