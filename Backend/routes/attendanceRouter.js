import express from "express"
import { errorHandler } from "../middleware/errorHandler.js"
import { createAttendance,getAllAttendance ,getSingleAttendance,updateAttendance,deleteAttendance} from "../controller/attendanceController.js"
const router = express.Router()

//creating attendance
router.post("/create-attendance",createAttendance)

//getall attendance
router.get("/get-allattendance",getAllAttendance)

//getSingle controller
router.get("/single-attendance/:id", getSingleAttendance);

//update addendance 
router.put("/update-attendance/:id", updateAttendance);


//delete attendance 
router.delete("/delete-attendance/:id", deleteAttendance);

export default router