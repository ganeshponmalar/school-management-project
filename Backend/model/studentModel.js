import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    },

    rollNumber: {
      type: String,
      required: [true, "Student Roll Number   is required"],
    
    },

    department: {
      type: String,
      required: [true, "Student Department is Required"],

    },

    hireDate: {
      type: String,
      required: [true, "student Role is required"],
     
    },

    qualification:{
        type: String,
       required: [true, "Teacher qualification Role is required"],
    }
})

const Student = mongoose.model("Student",studentSchema)
export default Student