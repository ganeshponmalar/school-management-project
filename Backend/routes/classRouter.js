import express from "express"
import { createClassController, getAllClassController, getSingleClassController, updateClassController, deleteClassController } from "../controller/classController.js"
import { adminToken } from "../middleware/auth.js"
const router = express.Router()

//create -class
router.post("/create-class", createClassController)

//get-all-class
router.get("/getAll-class", getAllClassController)


//geting Single-class
router.get("/single-class/:id", getSingleClassController)

//update controller
router.put("/update-class/:id", updateClassController)

//delete class
router.delete("/delete-class/:id", deleteClassController)

export default router