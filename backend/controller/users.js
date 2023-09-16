import { User } from "../models/userModel.js";
import catchAsyn from "../util/catchAsyn.js";
import { ErrorHandler } from "../util/errorHandler.js";

import { sendEmail } from "../util/sendMail.js";
import { sendToken } from "../util/sendToken.js";

export const createUser = catchAsyn(async (req, res, next) => {
  console.log(req.body);
  const { fName, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("Email already exists", 409));
  }
  if (!email || !password || !fName) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const otp = Math.floor(Math.random() * 10000);
  const otp_Expirey = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = await User.create({
    fName,
    email,
    password,
    avatar: {
      public_id: "public",
      url: "http://",
    },
    otp: otp,
    otp_Expirey: otp_Expirey,
  });
  console.log("created");
  await newUser.save();

  // await sendEmail({
  //   email: email,
  //   subject: "Account Confirmation",
  //   message: `Your Otp for Account Verification is  ${otp}`,
  // });

  sendToken(res, newUser, 200, " user created");
});

// export const verfiyAccount = catchAsyn(async (req, res, next) => {
//   const userOtp = Number(req.body.otp);

//   const user = await User.findOne({
//     otp: userOtp,
//     otp_Expirey: {
//       $gt: Date.now(),
//     },
//   });

//   if (!user) {
//     return next(new ErrorHandler("Invalid Otp", 403));
//   }
//   user.verified = true;
//   user.otp = null;
//   user.otp_Expirey = null;

//   await user.save();
//   sendToken(res, user, 200, "verified ");
// });

export const LoginUser = catchAsyn(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await user.checkPassward(password);

  if (!isMatch) {
    return next(new ErrorHandler("Password mismatch", 401));
  }

  sendToken(res, user, 200, "Login success");
});

export const forgetPassword = catchAsyn(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next();
  }

  const otp = Math.floor(Math.random() * 10000);

  user.passReset_Otp = otp;
  user.passReset_Otp_Expirey = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const message = `Your otp for password reset is ${otp}`;
  const options = {
    email: user.email,
    subject: "Password reset",
    message: "Your otp for password reset is ${otp}",
  };

  await sendEmail(options);
  res.status(200).json({
    success: true,

    user,

    message:
      "your password reset Otp has been successfully.Please check your email",
  });
});

export const passwordResetVerify = catchAsyn(async (req, res, next) => {
  const otp = Number(req.body.otp);

  const user = await User.findOne({
    passReset_Otp: otp,
    passReset_Otp_Expirey: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid OTP", 401));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const newPassword = catchAsyn(async (req, res, next) => {
  const otp = Number(req.body.otp);
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please Provide all fields", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("new password is not equal to the confirm password", 409)
    );
  }
  const user = await User.findOne({
    passReset_Otp: otp,
    passReset_Otp_Expirey: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid OTP", 401));
  }

  user.password = newPassword;
  user.passReset_Otp = null;
  user.passReset_Otp_Expirey = null;

  await user.save();

  sendToken(res, user, 200, "successfully updated password");
});

export const resetPassword = catchAsyn(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please enter all required fields", 401));
  }
  const user = User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyn(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("no such user", 404));
  }

  res.status(200).json({
    user,
  });
});

export const getProfile = catchAsyn(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("Couldn't find", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = catchAsyn(async function (req, res) {
  res
    .status(200)
    .cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
