import express from "express";
import {
  LoginUser,
  createUser,
  deleteUser,
  forgetPassword,
  getProfile,
  newPassword,
  passwordResetVerify,
  updateProfile,
} from "../controller/users.js";
import { isAuthenticated } from "../middleware/isAuthunticated.js";

const userRouter = express.Router();

userRouter.route("/register").post(createUser);

userRouter.route("/login").post(LoginUser);

userRouter.route("/me").get(isAuthenticated, getProfile);

userRouter.route("/updateProfile").patch(isAuthenticated, updateProfile);

userRouter.route("/forgetPassword").post(forgetPassword);

userRouter.route("/otpVerify").post(passwordResetVerify);

userRouter.route("/newPassword").post(newPassword);
userRouter.route("/logout").delete(deleteUser);
export default userRouter;
