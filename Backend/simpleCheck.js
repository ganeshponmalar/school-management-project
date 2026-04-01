import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/userModel.js";
import Parent from "./model/parentModel.js";

dotenv.config();

async function run() {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: "parent" }, "_id name email");
    console.log("PARENT USERS:", JSON.stringify(users, null, 2));

    const parents = await Parent.find({});
    console.log("PARENT RECORDS:", JSON.stringify(parents, null, 2));

    await mongoose.connection.close();
}

run();
