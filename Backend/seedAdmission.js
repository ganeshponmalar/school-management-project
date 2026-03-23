import mongoose from "mongoose";
import dotenv from "dotenv";
import Admission from "./model/admissionModel.js";
import Class from "./model/className.js";

dotenv.config();

const seedAdmissions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected for seeding admissions");

        // Clear existing admissions to start fresh (Optional)
        // await Admission.deleteMany({});
        // console.log("Cleared existing admissions");

        const classes = await Class.find();
        if (classes.length === 0) {
            console.error("No classes found. Please seed classes first.");
            process.exit(1);
        }

        const sampleAdmissions = [
            {
                name: "Alice Johnson",
                email: "alice@example.com",
                phone: "9876543210",
                gender: "female",
                dateOfBirth: new Date("2010-05-15"),
                address: "123 Maple St, Springfield",
                classId: classes[0]._id,
                section: classes[0].sections[0] || "A",
                fatherName: "Robert Johnson",
                motherName: "Mary Johnson",
                status: "pending"
            },
            {
                name: "Bob Smith",
                email: "bob@example.com",
                phone: "8765432109",
                gender: "male",
                dateOfBirth: new Date("2009-11-20"),
                address: "456 Oak Ave, Springfield",
                classId: classes[0]._id,
                section: classes[0].sections[1] || "B",
                fatherName: "John Smith",
                motherName: "Linda Smith",
                status: "approved"
            },
            {
                name: "Charlie Brown",
                email: "charlie@example.com",
                phone: "7654321098",
                gender: "male",
                dateOfBirth: new Date("2011-02-10"),
                address: "789 Pine Rd, Springfield",
                classId: classes.length > 1 ? classes[1]._id : classes[0]._id,
                section: classes.length > 1 ? (classes[1].sections[0] || "A") : (classes[0].sections[0] || "A"),
                fatherName: "David Brown",
                motherName: "Susan Brown",
                status: "rejected"
            }
        ];

        await Admission.insertMany(sampleAdmissions);
        console.log("Sample admissions seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admissions:", error);
        process.exit(1);
    }
};

seedAdmissions();
