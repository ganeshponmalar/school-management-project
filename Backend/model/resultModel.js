import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F"],
      default: "F",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;