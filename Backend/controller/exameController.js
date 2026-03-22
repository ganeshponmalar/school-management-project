import Exam from "../model/exameModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { errorHandler } from "../middleware/errorHandler.js";


//create exam details
export const createExam = errorHandler(async (req, res, next) => {
  const { name, classId, startDate, endDate } = req.body;

  if (!name || !classId || !startDate || !endDate) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (new Date(endDate) < new Date(startDate)) {
    return next(new ErrorHandler("End date must be after start date", 400));
  }

  const exam = await Exam.create({
    name,
    classId,
    startDate,
    endDate,
  });

  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    exam,
  });
});


//getAll exams controller
export const getAllExams = errorHandler(async (req, res, next) => {
  const exams = await Exam.find()
    .populate("classId", "className")
    .sort({ createdAt: -1 });

  if (!exams.length) {
    return next(new ErrorHandler("No exams found", 404));
  }

  res.status(200).json({
    success: true,
    count: exams.length,
    exams,
  });
});


//get single exam controller
export const getSingleExam = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  const exam = await Exam.findById(id)
    .populate("classId", "className");

  if (!exam) {
    return next(new ErrorHandler("Exam not found", 404));
  }

  res.status(200).json({
    success: true,
    exam,
  });
});


//getUpdate exam controller
export const updateExam = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, classId, startDate, endDate } = req.body;

  const exam = await Exam.findById(id);
  if (!exam) {
    return next(new ErrorHandler("Exam not found", 404));
  }

  if (name) exam.name = name;
  if (classId) exam.classId = classId;
  if (startDate) exam.startDate = startDate;
  if (endDate) exam.endDate = endDate;

  if (new Date(exam.endDate) < new Date(exam.startDate)) {
    return next(new ErrorHandler("End date must be after start date", 400));
  }

  await exam.save();

  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    exam,
  });
});


//delete controller
export const deleteExam = errorHandler(async (req, res, next) => {
  const { id } = req.params;

  const exam = await Exam.findById(id);

  if (!exam) {
    return next(new ErrorHandler("Exam not found", 404));
  }

  await exam.deleteOne();

  res.status(200).json({
    success: true,
    message: "Exam deleted successfully",
  });
});

