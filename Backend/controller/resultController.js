import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Result from "../model/resultModel.js";
import Student from "../model/studentModel.js";


// CREATE RESULT
export const createResult = errorHandler(async (req, res, next) => {
  const { studentId, examId, subject, marksObtained, totalMarks, grade } =
    req.body;

  if (!studentId || !examId || !subject || !marksObtained || !totalMarks || !grade) {
    return next(new ErrorHandler("All fields required", 400));
  }

  // Resolve Student
  let student;
  const sidStr = studentId.toString();
  if (sidStr.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(studentId);
  } else {
    const roll = Number(studentId);
    if (!isNaN(roll)) {
      student = await Student.findOne({ rollNumber: roll });
    }
  }

  if (!student) {
    return next(new ErrorHandler("Student not found (please check the Roll Number)", 404));
  }

  const result = await Result.create({
    studentId: student._id,
    examId,
    subject,
    marksObtained,
    totalMarks,
    grade,
  });

  res.status(201).json({
    success: true,
    message: "Result created successfully",
    result,
  });
});


// GET ALL RESULTS
export const getAllResults = errorHandler(async (req, res, next) => {
  const results = await Result.find()
    .populate("studentId")
    .populate("examId");

  res.status(200).json({
    success: true,
    count: results.length,
    results,
  });
});


// GET SINGLE RESULT
export const getSingleResult = errorHandler(async (req, res, next) => {
  const result = await Result.findById(req.params.id)
    .populate("studentId")
    .populate("examId");

  if (!result) {
    return next(new ErrorHandler("Result not found", 404));
  }

  res.status(200).json({
    success: true,
    result,
  });
});


// UPDATE RESULT
export const updateResult = errorHandler(async (req, res, next) => {
  const result = await Result.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!result) {
    return next(new ErrorHandler("Result not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Result updated successfully",
    result,
  });
});


// DELETE RESULT
export const deleteResult = errorHandler(async (req, res, next) => {
  const result = await Result.findByIdAndDelete(req.params.id);

  if (!result) {
    return next(new ErrorHandler("Result not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Result deleted successfully",
  });
});