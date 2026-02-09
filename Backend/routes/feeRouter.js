import express from "express";
import { createFee,getAllFees,getSingleFee,updateFee, deleteFee} from "../controller/feeController.js";

const router = express.Router();

//create fees
router.post("/create-fee", createFee);

//get all fees
router.get("/all-fee", getAllFees);

//single fees
router.get("/single-fee/:id", getSingleFee);

//update fees
router.put("/update-fee/:id", updateFee);

//delete fees
router.delete("/delete-fee/:id", deleteFee);

export default router;