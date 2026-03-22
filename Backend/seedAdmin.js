import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected for seeding");

        const email = "admin@gmail.com";
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        await User.create({
            name: "Admin User",
            email: email,
            password: "admin123",
            role: "admin",
            phone: "1234567890",
            gender: "male",
            address: "Admin Office",
            dateOfBirth: new Date("1990-01-01"),
        });

        console.log("Admin user created successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
