import express from "express";
import {
    sendNotification,
    getMyNotifications,
    deleteNotification,
} from "../controller/notificationController.js";
import { adminToken, isAuthenticated, teacherToken } from "../middleware/auth.js";

const router = express.Router();

// Send notification - Admin or Teacher
router.post("/send", isAuthenticated, (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "teacher") {
        return sendNotification(req, res, next);
    }
    res.status(403).json({ success: false, message: "Unauthorized to send notifications" });
});

// Get my notifications - Any authenticated user
router.get("/my", isAuthenticated, getMyNotifications);

// Delete notification - Admin only
router.delete("/delete/:id", adminToken, deleteNotification);

export default router;
