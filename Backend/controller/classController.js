import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import Class from "../model/className.js";

export const createClassController = errorHandler(async (req, res, next) => {
  const { name, sections } = req.body;

  if (!name) {
    return next(new ErrorHandler("Please provide class name", 400));
  }

  const existingClass = await Class.findOne({ name });

  if (existingClass) {
    return next(
      new ErrorHandler("Class with this name already exists", 400)
    );
  }

  const classData = await Class.create({
    name,
    sections: sections || [],
  });

  res.status(201).json({
    success: true,
    message: "Class created successfully",
    classData,
  });
});


//get all class

export const getAllClassController = errorHandler(async (req, res, next) => {
  const classes = await Class.find();

  if (!classes || classes.length === 0) {
    return next(new ErrorHandler("Class Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Classes Retrieved Successfully",
    classes,
  });
});



//getSingle classController
export const getSingleClassController = errorHandler(async (req, res, next) => {

    try{
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return next(new ErrorHandler("Class Not Found", 404));
  }

    res.status(200).json({
    success: true,
    message: "Class Found Successfully",
    classData,
  });

    }catch(error){
        console.log(error)
    }
  res.status(500).json({
    success: true,
    message: "Error in Get Single Class Controller",
    classData,
  });
});



//update the class
export const updateClassController = errorHandler(async (req, res, next) => {
  const { name, sections } = req.body;

  // Check class exists
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return next(new ErrorHandler("Class Not Found", 404));
  }

  // Update fields
  if (name) classData.name = name;

  if (sections) {
    classData.sections = Array.isArray(sections)
      ? sections
      : [sections];
  }

  await classData.save();

  res.status(200).json({
    success: true,
    message: "Class Updated Successfully",
    classData,
  });
});


//delete the class

export const deleteClassController = async (req, res, next) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return next(new ErrorHandler("Class Not Found", 404));
    }

    await classData.deleteOne();

    res.status(200).json({
      success: true,
      message: "Class Deleted Successfully",
    });

  } catch (error) {
    next(error); // send error to errorMiddleware
  }
};
