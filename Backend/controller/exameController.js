import Exam from "../model/exameModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js"


//create exam details
export const createExam = async (req, res) => {
  try {
    const { name, classId, startDate, endDate } = req.body;

    if (!name || !classId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const exam = await Exam.create({
      name,
      classId,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//getAll exams controller
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("classId", "className")
      .sort({ createdAt: -1 });

    if (!exams.length) {
      return res.status(404).json({
        success: false,
        message: "No exams found",
      });
    }

    res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//get single exam controller
export const getSingleExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id)
      .populate("classId", "className");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      exam,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//getUpdate exam controller
export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, classId, startDate, endDate } = req.body;

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (name) exam.name = name;
    if (classId) exam.classId = classId;
    if (startDate) exam.startDate = startDate;
    if (endDate) exam.endDate = endDate;

    if (new Date(exam.endDate) < new Date(exam.startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//delete controller
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

