import express from "express";
import {
    createUserController,
    logInController,
    createAdminController,
    getSingleAdmine,
    logOutAdmin,
    getAdminProfile,
    getCurrentUser,
    getAllUser
} from "../controller/userController.js"
import { adminToken ,isAuthenticated} from "../middleware/auth.js"

const router = express.Router()


router.post("/create_user", createUserController)

//login router
router.post("/logIn-user", logInController)
//admin create
router.post("/create-user", adminToken, createAdminController)

//get single admin
router.get("/single-admin/:id", adminToken, getSingleAdmine)

//admin logout
router.get("/logOut-admin", adminToken, logOutAdmin)

//get admin profile
router.get("/admin-profile",isAuthenticated,adminToken, getAdminProfile)

//get current user
router.get("/me",isAuthenticated,getCurrentUser)

//getAll User
router.get("/all-users",isAuthenticated,getAllUser)



export default router