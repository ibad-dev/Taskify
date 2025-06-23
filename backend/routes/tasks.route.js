import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controllers/task.controller.js";


const router=Router()

router.route("/create-task").post(isAuthenticated,createTask)
router.route("/update-task/:id").put(isAuthenticated,updateTask)
router.route("/delete-task/:id").delete(isAuthenticated,deleteTask)
router.route("/get-all-tasks").get(isAuthenticated,getAllTasks)
router.route("/get-task-by-id/:id").get(isAuthenticated,getTaskById)
export default router