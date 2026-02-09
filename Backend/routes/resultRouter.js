import express from "express";
import {
  createResult,
  getAllResults,
  getSingleResult,
  updateResult,
  deleteResult
} from "../controller/resultController.js";


const router = express.Router();

//create result
router.post("/create-result", createResult);


//get all result
router.get("/all-results", getAllResults);

//get single result
router.get("/single-result/:id", getSingleResult);

//update single result
router.put("/update-result/:id", updateResult);

//delete the result
router.delete("/delete-result/:id", deleteResult);

export default router;
