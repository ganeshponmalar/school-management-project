import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
        },
        gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: ["male", "female"],
            lowercase: true,
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: [true, "Class is required"],
        },
        section: {
            type: String,
            required: [true, "Section/Group is required"],
        },
        fatherName: {
            type: String,
            required: [true, "Father name is required"],
        },
        motherName: {
            type: String,
            required: [true, "Mother name is required"],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            lowercase: true,
        },
    },
    { timestamps: true }
);

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
