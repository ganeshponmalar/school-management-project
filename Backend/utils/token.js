export const jsontoken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  let cookieName;

  // ✅ MATCH DATABASE VALUES (lowercase)
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
    })
    .json({
      success: true,
      message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
};
