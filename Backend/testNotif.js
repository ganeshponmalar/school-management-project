// No node-fetch needed in Node 20
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";
import Notification from "./model/notificationModel.js";

dotenv.config();

const testNotification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const teacher = await User.findOne({ email: "joy@gmail.com" });
        if (!teacher) {
            console.log("Teacher not found");
            process.exit(1);
        }

        const notification = await Notification.create({
            sender: teacher._id,
            recipientGroup: "parents",
            title: "Parent-Teacher Meeting",
            message: "Dear parents, there is a meeting this Friday at 4 PM.",
        });

        console.log("Notification created successfully:", notification._id);

        // Now verify it for a parent
        const parentUser = await User.findOne({ role: "parent" });
        if (parentUser) {
            const myNotifs = await Notification.find({
                recipientGroup: { $in: ["all", "parents"] },
                status: "active",
            });
            console.log("Parent Notifications count:", myNotifs.length);
            const found = myNotifs.some(n => n.title === "Parent-Teacher Meeting");
            console.log("Found our meeting notification for parent:", found);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

testNotification();
