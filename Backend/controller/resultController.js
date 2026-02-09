import Result from "../model/resultModel.js";

import { errorHandler } from "../middleware/errorHandler.js";


// CREATE RESULT
export const createResult = async (req, res) => {
  try {
    const { studentId, examId, subject, marksObtained, totalMarks, grade } =
      req.body;

    if (!studentId || !examId || !subject || !marksObtained || !totalMarks || !grade) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const result = await Result.create({
      studentId,
      examId,
      subject,
      marksObtained,
      totalMarks,
      grade,
    });

    res.status(201).json({
      success: true,
      message: "Result created successfully",
      result,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// GET ALL RESULTS
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("studentId")
      .populate("examId");

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// GET SINGLE RESULT
export const getSingleResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("studentId")
      .populate("examId");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// UPDATE RESULT
export const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      result,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// DELETE RESULT
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};