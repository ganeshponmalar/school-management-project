import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler.js";
import Teacher from "../model/teacherModel.js";
import bcrypt from 'bcrypt';

export const createTeacherController = errorHandler(async (req, res, next) => {

    try {
        const { userId, subject, department, hireDate, qualification } = req.body;
        if (!userId || !subject || !department || !hireDate || !qualification) {
            return next(new errorHandler("Please Required all content"))

        }
        const teacher = await Teacher.create({
            userId,
            subject,
            department,
            hireDate,
            qualification,
        });

        //response here
        res.status(201).json({
            success: true,
            message: "Teacher Created Successfully",
            teacher,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in Creating Teacher Controller"
        })
    }
})


export const getAllTeacherController = errorHandler(async (req, res, next) => {

    try {
        const teachers = await Teacher.find().populate("userId")
        if (!teachers.length === 0) {
            return next(errorHandler("Teacher Not Found", 404))
        }
        res.status(200).json({
            success: true,
            message: "Teacher Retrived Successfully",
            teachers
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Error in Get All Controller",
            error
        })
    }
})


//get single teacher by id
export const getSingleTeacher = errorHandler(async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate("userId")

        if (!teacher) {
            return next(new errorHandler("Teacher Not Found", 404))
        }
        res.status(200).json({
            success: true,
            message: "Teacher Found Successfully",
            teacher,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Error in Get in single teacher",
            error
        })

    }
})

//getUpdate teacher
export const updateTeacherController = errorHandler(async (req, res, next) => {

    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,

        })
        if (!teacher) {
            return next(new errorHandler("Teacher Not Found", 404))
        }
        res.status(200).json({
            success: true,
            message: "Teacher Found Successfully",
            teacher,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Error in updateing in single teacher",
            error
        })
    }
})



export const deleteTeacherController = errorHandler(async (req, res, next) => {

    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Teacher ID", 400));
    }

    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Teacher Deleted Successfully",
    });
});

//logOut Teacher

export const logOutTeacher = errorHandler((req, res, next) => {
  res
    .status(200)
    .cookie("teacherToken", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Teacher Logged Out Successfully",
    });
});



//get Teacher profile
export const teacherProfile = errorHandler(async (req, res, next) => {

  console.log(req.user, "Logged Teacher");

  const teacher = await Teacher.findOne({
   
    userId: req.user._id,
  }).populate("userId");

  if (!teacher) {
    return next(new ErrorHandler("Teacher record not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Teacher Profile Found Successfully",
    teacher,
  });
});