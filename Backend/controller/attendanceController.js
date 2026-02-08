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

//getAll Controller
export const getAllAttendance = async (req, res, next) => {
  try {
    // Fetch all attendance records
    const attendance = await Attendance.find()
      .populate("studentId", "name email classId")
      .sort({ date: -1 });

    // Check if data exists
    if (!attendance || attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found",
      });
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
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

//getSingle attendance

export const getSingleAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ID provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Attendance ID is required",
      });
    }

    // Find attendance by ID
    const attendance = await Attendance.findById(id)
      .populate("studentId", "name email classId");

    // Check if attendance exists
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
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

//update attendance controller

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, classId, date, status } = req.body;

    // Check attendance exists
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    // Optional student validation
    if (studentId) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
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

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//delete addendance

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};