class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Mongo duplicate key
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate field value entered: ${Object.keys(err.keyValue)}`,
      400
    );
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token, please login again", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token expired, please login again", 401);
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });

  ;
};

export default ErrorHandler;
