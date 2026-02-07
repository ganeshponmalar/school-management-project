import express from "express"
import { errorHandler } from "../middleware/errorHandler.js"
import { createAttendance } from "../controller/attendanceController.js"
const router = express.Router()

//creating attendance
router.post("/create-attendance",createAttendance)

export default router