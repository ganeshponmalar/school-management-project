import jwt from "jsonwebtoken";
import express from "express";
import { errorHandler } from "../middleware/errorHandler.js";
import Attendance from "../model/attendanceModel.js";
import Student from "../model/studentModel.js";


export const createAttendance = async (req, res, next) => {
  try {
    const { studentId, classId, date, status } = req.body;

    // Validate input
    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Normalize date (remove time)
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      studentId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this student on this date",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      studentId,
      classId,
      date: attendanceDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Attendance created successfully",
      attendance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};