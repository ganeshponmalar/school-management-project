import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";

dotenv.config();

const findTeacher = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const teacher = await User.findOne({ role: "teacher" });
        if (teacher) {
            console.log("Teacher found:", teacher.email);
        } else {
            console.log("No teacher found.");
        }
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

findTeacher();
