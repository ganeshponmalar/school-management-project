import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minlength: [3, "Name must be at least 3 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      required: [true, "User Role is required"],
      enum: ["admin", "student", "teacher"],
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      match: [/^\d{10}$/, "Phone Number must be exactly 10 digits"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female"],
      lowercase: true,
    },

    address: {
      type: String,
      required: [true, "Address is Required"],
    },

    dateOfBirth: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },

    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

///  HASH PASSWORD (CORRECT – NO next())
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

///  COMPARE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

///  GENERATE JWT
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

export default mongoose.model("User", userSchema);
