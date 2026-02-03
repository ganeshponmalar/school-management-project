import express from "express";
import {createUserController,logInController} from "../controller/userController.js"

const router =express.Router()


router.post("/create_user",createUserController)

//login router
router.post("/logIn-user",logInController)


export default router