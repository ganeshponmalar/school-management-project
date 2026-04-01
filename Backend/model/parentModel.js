import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    studentIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        }
    ],
}, { timestamps: true });

const Parent = mongoose.model("Parent", parentSchema);
export default Parent;
