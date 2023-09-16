import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  welcome,
} from "../controller/taskController.js";
import { isAuthenticated } from "../middleware/isAuthunticated.js";

const router = express.Router();

router.route("/").get(welcome);

router.route("/newTask").post(isAuthenticated, createTask);

router.route("/getTask").get(isAuthenticated, getAllTasks);

router
  .route("/task/:taskId")
  .patch(isAuthenticated, updateTask)
  .delete(isAuthenticated, deleteTask)
  .get(isAuthenticated, getSingleTask);

export default router;
