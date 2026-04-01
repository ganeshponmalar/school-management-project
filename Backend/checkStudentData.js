import mongoose from "mongoose";
import dotenv from "dotenv";
import Attendance from "./model/attendanceModel.js";
import Result from "./model/resultModel.js";
import Notification from "./model/notificationModel.js";

dotenv.config();

const studentIds = ["69ca55dd949bca621181127e", "698afe53c89fa3a20a6546fd"];

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    for (const sid of studentIds) {
        console.log(`--- Checking Student ID: ${sid} ---`);
        const att = await Attendance.find({ studentId: sid });
        console.log(`Attendance count: ${att.length}`);

        const res = await Result.find({ studentId: sid });
        console.log(`Results count (total): ${res.length}`);
        console.log(`Results count (published): ${res.filter(r => r.isPublished).length}`);
    }

    const notifs = await Notification.find({ recipientGroup: { $in: ["all", "parents"] } });
    console.log(`--- Global Notifications ---`);
    console.log(`Notifications count (all/parents): ${notifs.length}`);
    console.log(JSON.stringify(notifs, null, 2));

    await mongoose.connection.close();
}

run();
