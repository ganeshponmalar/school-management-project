import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Teacher from "../model/teacherModel.js";
import bcrypt from 'bcrypt';

export const createTeacherController = errorHandler(async (req, res, next) => {
    const { userId, subject, department, hireDate, qualification } = req.body;
    if (!userId || !subject || !department || !hireDate || !qualification) {
        return next(new ErrorHandler("Please Required all content", 400));
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
    });
});


export const getAllTeacherController = errorHandler(async (req, res, next) => {
    const teachers = await Teacher.find().populate("userId").lean();
    if (teachers.length === 0) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Teacher Retrived Successfully",
        teachers
    });
});


//get single teacher by id
export const getSingleTeacher = errorHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.params.id).populate("userId").lean();

    if (!teacher) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Teacher Found Successfully",
        teacher,
    });
});

//getUpdate teacher
export const updateTeacherController = errorHandler(async (req, res, next) => {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!teacher) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Teacher Updated Successfully",
        teacher,
    });
});



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


