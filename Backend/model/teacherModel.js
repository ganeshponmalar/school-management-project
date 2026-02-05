import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    },

    subject: {
      type: String,
      required: [true, "Teacher Subject  is required"],
    
    },

    department: {
      type: String,
      required: [true, "Teacher Department is Required"],

    },

    hireDate: {
      type: String,
      required: [true, "Teacher Role is required"],
     
    },

    qualification:{
        type: String,
       required: [true, "Teacher qualification Role is required"],
    }
})

const Teacher = mongoose.model("Teacher",teacherSchema)
export default Teacher