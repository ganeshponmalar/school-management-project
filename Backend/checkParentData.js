import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";
import Parent from "./model/parentModel.js";
import Notification from "./model/notificationModel.js";
import Student from "./model/studentModel.js";

dotenv.config();

const checkData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected.");

        // Check all parents
        const parents = await Parent.find().populate("userId", "email role").populate("studentIds", "rollNumber");
        console.log("All Parents in DB count:", parents.length);
        console.log("All Parents in DB:", JSON.stringify(parents, null, 2));

        // Check all notifications for parents
        const notifs = await Notification.find({ recipientGroup: "parents" });
        console.log("Notifications for Parents count:", notifs.length);
        console.log("Notifications for Parents:", JSON.stringify(notifs, null, 2));

        // Check if any students exist
        const students = await Student.find({}, "rollNumber guardianInfo");
        console.log("Existing Students count:", students.length);
        console.log("Existing Students (partial):", JSON.stringify(students, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("Error in checkData script:", err);
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
};

checkData();
