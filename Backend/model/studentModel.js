import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    },

    rollNumber: {
      type: Number,
      required: [true, "Student Roll Number   is required"],
    
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Student Department is Required"],

    },

    admissionDate: {
      type: String,
      required: [true, "student Role is required"],
     
    },

    guardianInfo:{
        name: String,
        phone:String,
        relation:String,
       required: [true, "Teacher qualification Role is required"],
    }
})

const Student = mongoose.model("Student",studentSchema)
export default Student