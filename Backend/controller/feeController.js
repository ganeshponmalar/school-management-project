import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Fee from "../model/feeModel.js";
import Student from "../model/studentModel.js";

// Create Fee
export const createFee = errorHandler(async (req, res, next) => {
  const { studentId, amount, dueDate, paymentDate } = req.body;

  if (!studentId || !amount || !dueDate) {
    return next(new ErrorHandler("Student Roll Number or ID, amount, and dueDate are required", 400));
  }

  // Resolve Student (Handle both ObjectId and Roll Number)
  let student;
  if (studentId.toString().match(/^[0-9a-fA-F]{24}$/)) {
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

  const actualStudentId = student._id;

  let status = "pending";
  if (paymentDate) status = "paid";
  else if (new Date(dueDate) < new Date()) status = "overdue";

  const fee = await Fee.create({
    studentId: actualStudentId,
    amount,
    dueDate,
    paymentDate,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Fee created successfully",
    fee,
  });
});


//getAll fee
export const getAllFees = errorHandler(async (req, res, next) => {
  const fees = await Fee.find().populate("studentId");

  res.status(200).json({
    success: true,
    count: fees.length,
    fees,
  });
});


//get single fee
export const getSingleFee = errorHandler(async (req, res, next) => {
  const fee = await Fee.findById(req.params.id).populate("studentId");

  if (!fee) {
    return next(new ErrorHandler("Fee not found", 404));
  }

  res.status(200).json({
    success: true,
    fee,
  });
});


//update fee
export const updateFee = errorHandler(async (req, res, next) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!fee) {
    return next(new ErrorHandler("Fee not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Fee updated successfully",
    fee,
  });
});


//delete fee
export const deleteFee = errorHandler(async (req, res, next) => {
  const fee = await Fee.findByIdAndDelete(req.params.id);

  if (!fee) {
    return next(new ErrorHandler("Fee not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Fee deleted successfully",
  });
});