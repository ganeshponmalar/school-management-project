import jwt from "jsonwebtoken";
import express from "express";

import { errorHandler } from "../middleware/errorHandler.js";
import Student from "../model/studentModel.js";


export const createStudent = errorHandler(async (req,res,next)=>{
    const {userId,classId,section,rollNumber,admissionDate,guardianInfo} = req.body
        
    if (!userId || !classId || !section || !rollNumber || !admissionDate){
        return next(new errorHandler("Please Provide all required fields",400));
    }

    //existing student in database
    
    const existingStudent = await Student.findOne({classId,rollNumber});
    if(existingStudent){
        return next(new errorHandler("Roll number already exists in this class"))
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

export const getSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate("userId")
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//getall student details 

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId")
      .populate("classId");

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//student update 
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//delete the student data 

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


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
    return next(new errorHandler("Please login first", 401));
  }

  // Find student record using logged user ID
  const student = await Student.findOne({
    userId: req.user._id,
  })
    .populate("userId")
    .populate("classId");

  if (!student) {
    return next(new errorHandler("Student record not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Student profile fetched successfully",
    student,
  });
});