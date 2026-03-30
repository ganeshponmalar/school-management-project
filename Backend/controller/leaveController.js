import Leave from "../model/leaveModel.js";
import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

// Request Leave (Student/Teacher)
export const requestLeave = errorHandler(async (req, res, next) => {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const leave = await Leave.create({
        applicant: req.user._id,
        leaveType,
        fromDate,
        toDate,
        reason,
    });

    res.status(201).json({
        success: true,
        message: "Leave request submitted successfully",
        leave,
    });
});

// Get My Leaves
export const getMyLeaves = errorHandler(async (req, res, next) => {
    const leaves = await Leave.find({ applicant: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        leaves,
    });
});

// Get All Leaves (Admin Only)
export const getAllLeaves = errorHandler(async (req, res, next) => {
    const leaves = await Leave.find()
        .populate("applicant", "name email role")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        leaves,
    });
});

// Update Leave Status (Admin Only)
export const updateLeaveStatus = errorHandler(async (req, res, next) => {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
        return next(new ErrorHandler("Leave request not found", 404));
    }

    leave.status = status;
    leave.respondedBy = req.user._id;
    await leave.save();

    res.status(200).json({
        success: true,
        message: `Leave request ${status.toLowerCase()} successfully`,
        leave,
    });
});
