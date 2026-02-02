import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware";
import { errorHandler } from "./errorHandler";


//This is only for Register User
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.adminToken || req.cookies.teacherToken || req.cookies.studentToken

    if (token) {
        return next(new ErrorHandler("User is Not Authenticated", 401))
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decode.id)

        if (!req.user) {
            return next(new ErrorHandler("User Not Found", 404))
        }
        next()
    } catch (error) {
        return next(new ErrorHandler("Invalid token", 401))
    }
}



//this is only for student
export const studentToken = errorHandler(async (req, res, next) => {
    const token = req.cookies.studentToken;
    if (!token) {
        return next(new ErrorHandler("Student not authentication", 401));
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decode.id)

        if (!req.user || req.user.role !== "Student") {
            return next(new ErrorHandler("Student not authorized", 403))
        }
        next();

    } catch (error) {
        return next(new errorHandler('Invalid token', 401))
    }
});







//this is only for Teacher
export const teacherToken = errorHandler(async (req, res, next) => {
    const token = req.cookies.teacherToken;
    if (!token) {
        return next(new ErrorHandler("Teacher not authentication", 401));
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decode.id)

        if (!req.user || req.user.role !== "Teacher") {
            return next(new ErrorHandler("Teacher not authorized", 403))
        }
        next();

    } catch (error) {
        return next(new errorHandler('Invalid token', 401))
    }
});






//this is only for Teacher
export const adminToken = errorHandler(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Admin not authentication", 401));
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decode.id)

        if (!req.user || req.user.role !== "Admin") {
            return next(new ErrorHandler("Admin not authorized", 403))
        }
        next();

    } catch (error) {
        return next(new errorHandler('Invalid token', 401))
    }
});
















