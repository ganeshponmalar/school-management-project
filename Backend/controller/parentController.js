import Parent from "../model/parentModel.js";
import User from "../model/userModel.js";
import Student from "../model/studentModel.js";
import Attendance from "../model/attendanceModel.js";
import Result from "../model/resultModel.js";
import Fee from "../model/feeModel.js";
import Teacher from "../model/teacherModel.js";
import Class from "../model/className.js";
import Message from "../model/messageModel.js";
import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { jsontoken } from "../utils/token.js";

// Parent Self-Registration
export const registerParent = errorHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        phone,
        address,
        dateOfBirth,
        gender,
        studentRollNumber,
        studentPhone, // To verify relationship
    } = req.body;

    const trimmedRollNumber = studentRollNumber ? studentRollNumber.toString().trim() : "";
    const trimmedStudentPhone = studentPhone ? studentPhone.trim() : "";
    const trimmedEmail = email ? email.toString().toLowerCase().trim() : "";

    if (!name || !email || !password || !phone || !address || !dateOfBirth || !gender || !studentRollNumber || !studentPhone) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    // Verify Student exists and phone matches guardian phone
    const student = await Student.findOne({ rollNumber: trimmedRollNumber });
    if (!student) {
        return next(new ErrorHandler(`Student with Roll Number ${trimmedRollNumber} not found.`, 404));
    }

    if (student.guardianInfo.phone.trim() !== trimmedStudentPhone) {
        return next(new ErrorHandler(`Verification failed: Guardian Phone mismatch. Expected a match with the record.`, 403));
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
        return next(new ErrorHandler("User already exists with this email", 400));
    }

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role: "parent",
        phone,
        address,
        dateOfBirth,
        gender,
    });

    // Create Parent Record
    await Parent.create({
        userId: user._id,
        studentIds: [student._id],
    });

    res.status(201).json({
        success: true,
        message: "Parent registered successfully and linked to student",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

// Admin-led Parent Creation
export const adminCreateParent = errorHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        phone,
        address,
        dateOfBirth,
        gender,
        studentIds, // Array of student ObjectIds
    } = req.body;

    if (!name || !email || !password || !phone || !address || !dateOfBirth || !gender) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
    }

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role: "parent",
        phone,
        address,
        dateOfBirth,
        gender,
    });

    // Create Parent Record
    await Parent.create({
        userId: user._id,
        studentIds: studentIds || [],
    });

    res.status(201).json({
        success: true,
        message: "Parent created successfully by Admin",
        user,
    });
});

// Get All Parents (Admin)
export const getAllParents = errorHandler(async (req, res, next) => {
    const parents = await Parent.find()
        .populate("userId", "name email phone gender address")
        .populate("studentIds", "rollNumber section");

    res.status(200).json({
        success: true,
        parents,
    });
});

export const getMyStudents = errorHandler(async (req, res, next) => {
    const parent = await Parent.findOne({ userId: req.user._id }).populate("studentIds");
    if (!parent) {
        return next(new ErrorHandler("Parent record not found", 404));
    }

    // Populate student user info
    const students = await Student.find({ _id: { $in: parent.studentIds } }).populate("userId", "name email phone gender avatar");

    res.status(200).json({
        success: true,
        students,
    });
});

// Get Student Attendance
export const getStudentAttendance = errorHandler(async (req, res, next) => {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ studentId });
    res.status(200).json({
        success: true,
        attendance,
    });
});

// Get Student Marks
export const getStudentMarks = errorHandler(async (req, res, next) => {
    const { studentId } = req.params;
    const results = await Result.find({ studentId, isPublished: true }).populate("examId", "name");
    res.status(200).json({
        success: true,
        results,
    });
});

// Get Student Fees
export const getStudentFees = errorHandler(async (req, res, next) => {
    const { studentId } = req.params;
    const fees = await Fee.find({ studentId });
    res.status(200).json({
        success: true,
        fees,
    });
});

// Get Teachers for Student's Class
export const getStudentTeachers = errorHandler(async (req, res, next) => {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
        return next(new ErrorHandler("Student not found", 404));
    }

    // Find teachers assigned to this classId
    const teachers = await Teacher.find({ classId: student.classId }).populate("userId", "name email phone gender avatar");

    res.status(200).json({
        success: true,
        teachers,
    });
});

// Messaging
export const sendMessage = errorHandler(async (req, res, next) => {
    const { receiverId, studentId, message } = req.body;
    if (!receiverId || !studentId || !message) {
        return next(new ErrorHandler("Please provide all fields", 400));
    }

    const newMessage = await Message.create({
        senderId: req.user._id,
        receiverId,
        studentId,
        message,
    });

    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        newMessage,
    });
});

export const getMessages = errorHandler(async (req, res, next) => {
    const { studentId, otherUserId } = req.query;
    const messages = await Message.find({
        studentId,
        $or: [
            { senderId: req.user._id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: req.user._id },
        ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        messages,
    });
});

// Teacher: Publish Result
export const publishResult = errorHandler(async (req, res, next) => {
    const { resultId } = req.params;
    const result = await Result.findByIdAndUpdate(resultId, { isPublished: true }, { new: true });

    if (!result) {
        return next(new ErrorHandler("Result not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Result published to parent successfully",
        result,
    });
});

// Teacher: Find Parent by Student Name/Roll for Chat
export const findParentByStudent = errorHandler(async (req, res, next) => {
    const { rollNumber } = req.query;
    const student = await Student.findOne({ rollNumber }).populate("userId", "name");

    if (!student) {
        return next(new ErrorHandler("Student not found", 404));
    }

    const parent = await Parent.findOne({ studentIds: student._id }).populate("userId", "name email phone avatar");

    if (!parent) {
        return next(new ErrorHandler("No parent linked to this student", 404));
    }

    res.status(200).json({
        success: true,
        parent,
        studentName: student.userId?.name
    });
});

// Parent: Link a Student to Account
export const linkStudent = errorHandler(async (req, res, next) => {
    const { studentRollNumber, studentPhone } = req.body;

    if (!studentRollNumber || !studentPhone) {
        return next(new ErrorHandler("Please provide Student Roll Number and Guardian Phone", 400));
    }

    const trimmedRollNumber = studentRollNumber.toString().trim();
    const trimmedStudentPhone = studentPhone.trim();

    // Find student
    const student = await Student.findOne({ rollNumber: trimmedRollNumber });
    if (!student) {
        return next(new ErrorHandler(`Student with Roll Number ${trimmedRollNumber} not found.`, 404));
    }

    // Verify phone matches guardian record
    if (student.guardianInfo.phone.trim() !== trimmedStudentPhone) {
        return next(new ErrorHandler(`Verification failed: Guardian Phone mismatch.`, 403));
    }

    // Find parent record
    let parent = await Parent.findOne({ userId: req.user._id });
    if (!parent) {
        // Create if doesn't exist (though should exist for parent role)
        parent = await Parent.create({
            userId: req.user._id,
            studentIds: [student._id],
        });
    } else {
        // Check if student already linked
        if (parent.studentIds.includes(student._id)) {
            return next(new ErrorHandler("This student is already linked to your account", 400));
        }
        parent.studentIds.push(student._id);
        await parent.save();
    }

    res.status(200).json({
        success: true,
        message: "Student linked successfully",
        student: {
            id: student._id,
            rollNumber: student.rollNumber,
            name: student.userId?.name
        }
    });
});
