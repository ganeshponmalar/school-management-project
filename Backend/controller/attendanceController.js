import jwt from "jsonwebtoken";
import express from "express";
import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Attendance from "../model/attendanceModel.js";
import Student from "../model/studentModel.js";


export const createAttendance = errorHandler(async (req, res, next) => {
  const { studentId, classId, date, status } = req.body;

  // Validate input
  if (!studentId || !classId || !date || !status) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Check student exists (Handle both ObjectId and Roll Number)
  let student;
  if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(studentId);
  } else {
    student = await Student.findOne({ rollNumber: studentId });
  }

  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  // Use the actual ObjectId for the record
  // Use the actual ObjectId for the record
  const actualStudentId = student._id;
  const actualClassId = student.classId;

  // Normalize date (remove time)
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  // Check duplicate attendance
  const existingAttendance = await Attendance.findOne({
    studentId: actualStudentId,
    date: attendanceDate,
  });

  if (existingAttendance) {
    return next(new ErrorHandler("Attendance already marked for this student on this date", 400));
  }

  // Create attendance
  const attendance = await Attendance.create({
    studentId: actualStudentId,
    classId: actualClassId,
    date: attendanceDate,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Attendance created successfully",
    attendance,
  });
});


//getAll Controller
export const getAllAttendance = errorHandler(async (req, res, next) => {
  // Fetch all attendance records
  const attendance = await Attendance.find()
    .populate("studentId", "name email classId")
    .sort({ date: -1 });

  // Check if data exists
  if (!attendance || attendance.length === 0) {
    return next(new ErrorHandler("No attendance records found", 404));
  }

  res.status(200).json({
    success: true,
    count: attendance.length,
    attendance,
  });
});


//getSingle attendance
export const getSingleAttendance = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find attendance by ID
  const attendance = await Attendance.findById(id)
    .populate("studentId", "name email classId");

  // Check if attendance exists
  if (!attendance) {
    return next(new ErrorHandler("Attendance not found", 404));
  }

  res.status(200).json({
    success: true,
    attendance,
  });
});


//update attendance controller
export const updateAttendance = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { studentId, classId, date, status } = req.body;

  // Check attendance exists
  const attendance = await Attendance.findById(id);
  if (!attendance) {
    return next(new ErrorHandler("Attendance not found", 404));
  }

  // Optional student validation while requesting with studentId
  if (studentId) {
    const student = await Student.findById(studentId); //checking student in the database
    if (!student) {
      return next(new ErrorHandler("Student not found", 404));
    }
    attendance.studentId = studentId;
  }

  if (classId) attendance.classId = classId;

  if (date) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    attendance.date = attendanceDate;
  }

  if (status) attendance.status = status;

  await attendance.save();

  res.status(200).json({
    success: true,
    message: "Attendance updated successfully",
    attendance,
  });
});


//delete addendance
export const deleteAttendance = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  const attendance = await Attendance.findById(id);

  if (!attendance) {
    return next(new ErrorHandler("Attendance not found", 404));
  }

  await attendance.deleteOne();

  res.status(200).json({
    success: true,
    message: "Attendance deleted successfully",
  });
});