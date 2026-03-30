import express from "express";
import {
    requestLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
} from "../controller/leaveController.js";
import { adminToken, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Request leave - Student or Teacher
router.post("/request", isAuthenticated, requestLeave);

// Get my leaves - Student or Teacher
router.get("/my", isAuthenticated, getMyLeaves);

// Get all leaves - Admin only
router.get("/all", adminToken, getAllLeaves);

// Update leave status - Admin only
router.put("/update/:id", adminToken, updateLeaveStatus);

export default router;
