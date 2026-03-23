import express from "express";
import {
    createAdmission,
    getAllAdmissions,
    getAdmissionById,
    updateAdmissionStatus,
    deleteAdmission
} from "../controller/admissionController.js";
import { adminToken, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-admission", adminToken, createAdmission);
router.get("/get-all", isAuthenticated, getAllAdmissions); // Both Admin and Teacher can see via isAuthenticated
router.get("/get-single/:id", isAuthenticated, getAdmissionById);
router.put("/update-status/:id", adminToken, updateAdmissionStatus);
router.delete("/delete-admission/:id", adminToken, deleteAdmission);

export default router;
