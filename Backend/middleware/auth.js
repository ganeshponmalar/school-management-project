import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import ErrorHandler from "./errorMiddleware.js";
import { errorHandler } from "./errorHandler.js";


  // AUTHENTICATED USER

export const isAuthenticated = errorHandler(async (req, res, next) => {
  const token =
    req.cookies.adminToken ||
    req.cookies.teacherToken ||
    req.cookies.studentToken;

  // ✅ FIXED
  if (!token) {
    return next(new ErrorHandler("User is Not Authenticated", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decode.id);

  if (!req.user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  next();
});


 // STUDENT ONLY

export const studentToken = errorHandler(async (req, res, next) => {
  const token = req.cookies.studentToken;

  if (!token) {
    return next(new ErrorHandler("Student not authenticated", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decode.id);

  if (!req.user || req.user.role !== "student") {
    return next(new ErrorHandler("Student not authorized", 403));
  }

  next();
});




  // ADMIN ONLY

export const adminToken = errorHandler(async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return next(new ErrorHandler("Admin not authenticated", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decode.id);

  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Admin not authorized", 403));
  }

  next();
});

// TEACHER AUTH ONLY
export const teacherToken = errorHandler(async (req, res, next) => {

  // Check cookie first
  const token = req.cookies.teacherToken;

  if (!token) {
    return next(new ErrorHandler("Teacher not authenticated", 401));
  }

  // Verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Find user
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check role (IMPORTANT lowercase)
  if (user.role !== "teacher") {
    return next(new ErrorHandler("Teacher not authorized", 403));
  }

  // Attach user to request
  req.user = user;

  next();
});












