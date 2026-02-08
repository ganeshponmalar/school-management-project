import express from "express"

import { createExam, getAllExams,getSingleExam,updateExam,deleteExam} from "../controller/exameController.js";
import { adminToken } from "../middleware/auth.js"
const router = express.Router()

//create -exam
router.post("/create-exam", createExam);

//get-allexam
router.get("/get-all-exams", getAllExams);

//getsingle exam controller
router.get("/single-exam/:id", getSingleExam);

//update exam controller
router.put("/update-exam/:id", updateExam);

//delete exam controller
router.delete("/delete-exam/:id", deleteExam);

export default router