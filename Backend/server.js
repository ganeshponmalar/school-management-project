import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import teacherRouter from "./routes/teacherRouter.js"
import classRouter from "./routes/classRouter.js"
import studentRouter from "./routes/studentRouter.js"
import attendanceRouter from "./routes/attendanceRouter.js"
import examRouter from "./routes/examRouter.js";
import feeRouter from "./routes/feeRouter.js"
import resultRouter from "./routes/resultRouter.js"



dotenv.config();

const app = express();

// 🌥️ Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔧 Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// 🗄️ Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Database error:", err));

// 🚏 Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/class", classRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/fee", feeRouter);
app.use("/api/v1/result", resultRouter);

// ❗ ERROR MIDDLEWARE — MUST BE LAST
app.use(errorMiddleware);

// 🚀 Start server (LAST LINE)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
