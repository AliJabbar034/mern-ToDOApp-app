import express, { json, urlencoded } from "express";
import router from "./routes/taskRouter.js";
import cors from "cors";
import { ErrorHandler } from "./util/errorHandler.js";
import appError from "./middleware/appError.js";
import errorMiddleware from "./middleware/appError.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import morgan from "morgan";
export const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("tiny"));

app.use("/api/v1", router);
app.use("/api/v1", userRouter);

app.all("*", function (next) {
  return next(new ErrorHandler("not found", 404));
});

app.use(errorMiddleware);
