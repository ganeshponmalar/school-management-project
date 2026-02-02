import express from "express";
import {createUserController} from "../controller/userController.js"

const router =express.Router()


router.post("/create_user",createUserController)


export default router