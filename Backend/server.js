import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from "./routes/userRouter.js"
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();
import morgan from 'morgan';
import cors from 'cors';

const app = express()


const port = process.env.PORT || 5000
const url = process.env.MONGO_URI


app.use(cors({
    origin:"http://localhost:5174",
    method:["GET","POST","PUT","DELETE"],
    credentials: true
}))


app.use(express.json())
app.use(morgan("dev"))


mongoose.connect(url).then(()=>{
    console.log(`Database Connection Successfully`)
}).catch((err)=>console.log("Database error is ",err))

app.use("/api/v1/user",userRouter)


app.listen(port,()=>{
    console.log(`server started on port ${port}`);
})

app.use(errorMiddleware)
