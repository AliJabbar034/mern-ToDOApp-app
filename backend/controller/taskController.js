import { Tasks } from "../models/tasks.js";
import { ApiFeatures } from "../util/apiFeatures.js";
import catchAsyn from "../util/catchAsyn.js";
import { ErrorHandler } from "../util/errorHandler.js";

export const createTask = catchAsyn(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  const { title, description, startAt, endAt, priority } = req.body;
  const task = await Tasks.create({
    title,
    description,
    startAt,
    endAt,
    priority,
    createdBy: req.body.createdBy,
  });
  if (!task) {
    return next(new ErrorHandler("Task creation failed", 424));
  }

  res.status(200).json({
    success: true,
    task,
  });
});

export const getAllTasks = catchAsyn(async (req, res, next) => {
  // const apiFeatures = new ApiFeatures(Tasks.find(), req.query).filter();

  const tasks = await Tasks.find({
    createdBy: req.user._id,
  });

  if (!tasks) {
    return next(new ErrorHandler("Task not found", 404));
  }
  res.status(200).json({
    success: true,
    tasks,
  });
});

export const updateTask = catchAsyn(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  let task = await Tasks.find({
    _id: req.params.taskId,
    createdBy: req.user._id,
  });

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  task = await Tasks.findByIdAndUpdate(req.params.taskId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    task,
  });
});

export const deleteTask = catchAsyn(async (req, res, next) => {
  const { taskId } = req.params;
  const task = await Tasks.findByIdAndDelete({
    _id: taskId,
    createdBy: req.user._id,
  });
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  res.status(200).json({
    success: true,
    task,
  });
});

export const welcome = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome",
  });
};

export const getSingleTask = catchAsyn(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Tasks.findById({
    _id: taskId,
    createdBy: req.user._id,
  });

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Task successfully found",
    task,
  });
});
