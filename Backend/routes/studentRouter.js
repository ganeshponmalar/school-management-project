import express from "express"
import {
    createStudent, getSingleStudent, getAllStudents, updateStudent,
    deleteStudent, logoutStudent, studentProfile
} from "../controller/studentController.js"
const router = express.Router()


//create student
router.post("/create-student", createStudent)

//get Single details
router.get("/get-student/:id", getSingleStudent)

//get all student 
router.get("/get-allStudent", getAllStudents)

//student update
router.put("/update-student/:id", updateStudent)


//Delete the student
router.delete("/delete-student", deleteStudent)

//logout the student
router.post("/logout-student", logoutStudent)

//find student
router.get("/student-profile", studentProfile)

export default router;
