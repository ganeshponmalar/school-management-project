export const jsontoken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  let cookieName;

  switch (user.role) {
    case "admin":
      cookieName = "adminToken";
      break;
    case "teacher":
      cookieName = "teacherToken";
      break;
    case "student":
      cookieName = "studentToken";
      break;
    default:
      return res.status(400).json({
        success: false,
        message: "Invalid User Role",
      });
  }

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,

      //  VERY IMPORTANT FOR FRONTEND + POSTMAN
      sameSite: "lax",

      //  Only true in production HTTPS
      secure: false,
    })
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};