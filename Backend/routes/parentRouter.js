import express from "express";
import {
    registerParent,
    getMyStudents,
    getStudentAttendance,
    getStudentMarks,
    getStudentFees,
    getStudentTeachers,
    sendMessage,
    getMessages,
    adminCreateParent,
    getAllParents,
    publishResult,
    findParentByStudent,
    linkStudent
} from "../controller/parentController.js";
import { parentToken, isAuthenticated, adminToken, teacherToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerParent);
router.post("/admin/create", adminToken, adminCreateParent);
router.get("/admin/all", adminToken, getAllParents);

// Protected routes (Only Parents can access their dashboard data)
router.post("/link-student", parentToken, linkStudent);
router.get("/my-students", parentToken, getMyStudents);
router.get("/student/attendance/:studentId", parentToken, getStudentAttendance);
router.get("/student/marks/:studentId", parentToken, getStudentMarks);
router.get("/student/fees/:studentId", parentToken, getStudentFees);
router.get("/student/teachers/:studentId", parentToken, getStudentTeachers);

// Messaging routes
router.post("/message/send", isAuthenticated, sendMessage);
router.get("/messages", isAuthenticated, getMessages);

// Teacher Tools
router.put("/teacher/publish-result/:resultId", teacherToken, publishResult);
router.get("/teacher/find-parent", teacherToken, findParentByStudent);

export default router;
