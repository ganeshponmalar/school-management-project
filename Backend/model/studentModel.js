import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  rollNumber: {
    type: Number,
    required: [true, "Student Roll Number is required"],
  },

  classId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Student Department is Required"],
  },

  section: {
    type: String,
    required: true,
  },

  admissionDate: {
    type: String,
    required: [true, "Student admission date is required"],
  },

  guardianInfo: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
  }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;