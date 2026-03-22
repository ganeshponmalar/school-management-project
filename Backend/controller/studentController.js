import jwt from "jsonwebtoken";
import express from "express";

import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Student from "../model/studentModel.js";


export const createStudent = errorHandler(async (req, res, next) => {
  const { userId, classId, section, rollNumber, admissionDate, guardianInfo } = req.body

  if (!userId || !classId || !section || !rollNumber || !admissionDate) {
    return next(new ErrorHandler("Please Provide all required fields", 400));
  }

  //existing student in database

  const existingStudent = await Student.findOne({ classId, rollNumber });
  console.log(existingStudent, 'iam from existing student')
  if (existingStudent) {
    return next(new ErrorHandler("Roll number already exists in this class"))
  }

  const student = await Student.create({
    userId,
    rollNumber,
    classId,
    section,
    admissionDate,
    guardianInfo
  })
  res.status(201).json({
    success: true,
    message: "Student Create Successful",
    student,
  })

})

//single student deatails

export const getSingleStudent = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  const student = await Student.findById(id)
    .populate("userId")
    .populate("classId")
    .lean();

  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  res.status(200).json({
    success: true,
    student,
  });
});

//getall student details 

export const getAllStudents = errorHandler(async (req, res, next) => {
  const students = await Student.find()
    .populate("userId")
    .populate("classId")
    .lean();

  if (!students.length) {
    return next(new ErrorHandler("No students found", 404));
  }

  res.status(200).json({
    success: true,
    count: students.length,
    students,
  });
});

//student update 
export const updateStudent = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    return next(new ErrorHandler("Student not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    student: updatedStudent,
  });
});

//delete the student data 

export const deleteStudent = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});


//logout Student
export const logoutStudent = (req, res) => {
  try {
    res.cookie("studentToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};



export const studentProfile = errorHandler(async (req, res, next) => {

  // Check authentication
  if (!req.user) {
    return next(new ErrorHandler("Please login first", 401));
  }

  // Find student record using logged user ID
  const student = await Student.findOne({
    userId: req.user._id,
  })
    .populate("userId")
    .populate("classId");

  if (!student) {
    return next(new ErrorHandler("Student record not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Student profile fetched successfully",
    student,
  });
});