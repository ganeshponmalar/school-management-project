import express from "express";
import {createUserController,logInController,createAdminController,getSingleAdmine,logOutAdmin} from "../controller/userController.js"
import { adminToken } from "../middleware/auth.js"

const router =express.Router()


router.post("/create_user",createUserController)

//login router
router.post("/logIn-user",logInController)
//admin create
router.post("/create-user", adminToken,createAdminController)

//get single admin
router.get("/single-admin/:id",adminToken,getSingleAdmine )

//admin logout
router.get("/logOut-admin",adminToken,logOutAdmin)



export default router