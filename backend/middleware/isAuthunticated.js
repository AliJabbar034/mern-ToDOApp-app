import { User } from "../models/userModel.js";
import catchAsyn from "../util/catchAsyn.js";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../util/errorHandler.js";

export const isAuthenticated = catchAsyn(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Authentication failed", 401));
  }

  const decodeUser = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodeUser._id);
  if (!req.user) {
    return next(new ErrorHandler("Couldn't find", 409));
  }

  next();
});
