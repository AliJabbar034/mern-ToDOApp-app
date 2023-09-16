export const sendToken = async (res, user, statusCode, message) => {
  const token = await user.getJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 86400000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
    token,
  });
};
