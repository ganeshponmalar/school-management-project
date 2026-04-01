import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientGroup: {
            type: String,
            enum: ["all", "students", "teachers", "parents"],
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
        },
        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
