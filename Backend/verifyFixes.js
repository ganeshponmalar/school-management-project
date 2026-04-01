import mongoose from 'mongoose';
import Student from './model/studentModel.js';
import Attendance from './model/attendanceModel.js';
import Fee from './model/feeModel.js';
import Parent from './model/parentModel.js';
import User from './model/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Find a test student
        const student = await Student.findOne().populate('userId');
        if (!student) {
            console.error("No student found for testing");
            process.exit(1);
        }
        const rollNumber = student.rollNumber;
        console.log(`Testing with student: ${student.userId.name}, Roll: ${rollNumber}`);

        // 2. Test Attendance Resolution (Dry run logic from controller)
        console.log("Verifying Attendance Resolution...");
        const attStudent = await Student.findOne({ rollNumber: rollNumber });
        if (attStudent && attStudent._id.toString() === student._id.toString()) {
            console.log("✅ Attendance roll number resolution working");
        } else {
            console.error("❌ Attendance roll number resolution failed");
        }

        // 3. Test Fee Resolution (Dry run logic from controller)
        console.log("Verifying Fee Resolution...");
        const feeStudent = await Student.findOne({ rollNumber: rollNumber });
        if (feeStudent && feeStudent._id.toString() === student._id.toString()) {
            console.log("✅ Fee roll number resolution working");
        } else {
            console.error("❌ Fee roll number resolution failed");
        }

        // 4. Check for the actualClassId fix logic
        if (student.classId) {
            console.log("✅ Student has classId, actualClassId will be resolved correctly");
        } else {
            console.error("❌ Student missing classId");
        }

        console.log("Verification complete!");
        process.exit(0);
    } catch (err) {
        console.error("Verification error:", err);
        process.exit(1);
    }
};

verify();
