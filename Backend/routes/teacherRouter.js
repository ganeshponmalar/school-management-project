import express from "express";
import {
    createTeacherController, getAllTeacherController, getSingleTeacher,
    updateTeacherController, deleteTeacherController, logOutTeacher, teacherProfile
} from "../controller/teacherController.js";
const router = express.Router()
import { teacherToken ,isAuthenticated} from "../middleware/auth.js";



//creating teacher
router.post("/create-teacher", createTeacherController)

//getAll teacher
router.get("/get-teacher", getAllTeacherController)

//get single teacherById
router.get("/single-teacher/:id", getSingleTeacher)

//update teacher
router.put("/update-teacher/:id", updateTeacherController);

//deleteing Teacher Byid
router.delete("/delete-teacher/:id", deleteTeacherController)

//teacher logout
router.post("/logout-teacher", teacherToken, logOutTeacher)

//get teacher profile controller
router.get("/teacher-profile", teacherToken, teacherProfile);

export default router