import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";
import Teacher from "./model/teacherModel.js";
import Student from "./model/studentModel.js";
import Class from "./model/className.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected for seeding all roles");

        // 1. Seed Classes if none exist
        let classes = await Class.find();
        if (classes.length === 0) {
            console.log("Seeding classes...");
            classes = await Class.insertMany([
                { name: "10th", sections: ["A", "B", "C"] },
                { name: "11th", sections: ["Biology", "Computer"] },
                { name: "12th", sections: ["Biology", "Computer", "Commerce"] }
            ]);
            console.log("Classes seeded.");
        }

        // 2. Seed an Admin if none exists
        const existingAdmin = await User.findOne({ role: "admin" });
        if (!existingAdmin) {
            console.log("Seeding admin...");
            await User.create({
                name: "Main Admin",
                email: "admin@school.com",
                password: "admin123", // Assuming plain password as per userController
                role: "admin",
                phone: "1234567890",
                address: "Admin Office",
                gender: "male",
                dateOfBirth: new Date("1985-01-01")
            });
            console.log("Admin seeded.");
        }

        // 3. Seed Teachers
        const existingTeacher = await User.findOne({ role: "teacher" });
        if (!existingTeacher) {
            console.log("Seeding teachers...");
            const teacherUser = await User.create({
                name: "John Teacher",
                email: "teacher@school.com",
                password: "teacher123",
                role: "teacher",
                phone: "2233445566",
                address: "Teacher Quarter 1",
                gender: "male",
                dateOfBirth: new Date("1990-05-20")
            });

            await Teacher.create({
                userId: teacherUser._id,
                subject: "Mathematics",
                department: "Science",
                qualification: "M.Sc Mathematics",
                hireDate: new Date("2020-01-01")
            });
            console.log("Teacher seeded.");
        }

        // 4. Seed Students
        const existingStudent = await User.findOne({ role: "student" });
        if (!existingStudent) {
            console.log("Seeding students...");
            const studentUser = await User.create({
                name: "Sam Student",
                email: "student@school.com",
                password: "student123",
                role: "student",
                phone: "9988776655",
                address: "Student Hostel A",
                gender: "male",
                dateOfBirth: new Date("2008-10-10")
            });

            await Student.create({
                userId: studentUser._id,
                rollNumber: 101,
                classId: classes[0]._id, // 10th
                section: "A",
                admissionDate: "2023-06-01",
                guardianInfo: {
                    name: "Mr. Parent",
                    phone: "9900000000",
                    relation: "Father"
                }
            });
            console.log("Student seeded.");
        }

        console.log("All data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
};

seedData();
