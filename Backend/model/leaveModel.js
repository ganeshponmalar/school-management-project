import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        leaveType: {
            type: String,
            required: [true, "Leave type is required"],
            enum: ["Sick Leave", "Casual Leave", "Emergency Leave", "Other"],
        },
        fromDate: {
            type: Date,
            required: [true, "From date is required"],
        },
        toDate: {
            type: Date,
            required: [true, "To date is required"],
        },
        reason: {
            type: String,
            required: [true, "Reason is required"],
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
