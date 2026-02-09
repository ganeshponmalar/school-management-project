import Fee from "../model/feeModel.js";


// Create Fee
export const createFee = (async (req, res) => {
  const { studentId, amount, dueDate, paymentDate } = req.body;

  if (!studentId || !amount || !dueDate) {
    return res.status(400).json({
      success: false,
      message: "StudentId, amount, dueDate required",
    });
  }

  let status = "pending";

  if (paymentDate) status = "paid";
  else if (new Date(dueDate) < new Date()) status = "overdue";

  const fee = await Fee.create({
    studentId,
    amount,
    dueDate,
    paymentDate,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Fee created successfully",
    fee,
  });
});


//getAll fee
export const getAllFees = (async (req, res, next) => {
  try {
    const fees = await Fee.find().populate("studentId");

    res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//get single fee
export const getSingleFee = (async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("studentId");

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.status(200).json({
      success: true,
      fee,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//update fee
export const updateFee = (async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      fee,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete fee
export const deleteFee = (async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});