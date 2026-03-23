import Admission from "../model/admissionModel.js";
import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

// Create new admission (Admin)
export const createAdmission = errorHandler(async (req, res, next) => {
    const {
        name,
        email,
        phone,
        gender,
        dateOfBirth,
        address,
        classId,
        section,
        fatherName,
        motherName
    } = req.body;

    if (!name || !email || !phone || !gender || !dateOfBirth || !address || !classId || !section || !fatherName || !motherName) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const existingAdmission = await Admission.findOne({ email });
    if (existingAdmission) {
        return next(new ErrorHandler("Admission record with this email already exists", 400));
    }

    const admission = await Admission.create({
        name,
        email,
        phone,
        gender,
        dateOfBirth,
        address,
        classId,
        section,
        fatherName,
        motherName
    });

    res.status(201).json({
        success: true,
        message: "Admission record created successfully",
        admission
    });
});

// Get all admissions (Admin / Teacher)
export const getAllAdmissions = errorHandler(async (req, res, next) => {
    const admissions = await Admission.find().populate("classId", "name");

    res.status(200).json({
        success: true,
        count: admissions.length,
        admissions
    });
});

// Get single admission by ID
export const getAdmissionById = errorHandler(async (req, res, next) => {
    const admission = await Admission.findById(req.params.id).populate("classId", "name");

    if (!admission) {
        return next(new ErrorHandler("Admission record not found", 404));
    }

    res.status(200).json({
        success: true,
        admission
    });
});

// Update admission status (Admin)
export const updateAdmissionStatus = errorHandler(async (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return next(new ErrorHandler("Status is required", 400));
    }

    const admission = await Admission.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!admission) {
        return next(new ErrorHandler("Admission record not found", 404));
    }

    res.status(200).json({
        success: true,
        message: `Admission status updated to ${status}`,
        admission
    });
});

// Delete admission record (Admin)
export const deleteAdmission = errorHandler(async (req, res, next) => {
    const admission = await Admission.findByIdAndDelete(req.params.id);

    if (!admission) {
        return next(new ErrorHandler("Admission record not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Admission record deleted successfully"
    });
});
