import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Task from "../models/Tasks.js";

const createTask = asyncHandler(async (req, res) => {
  const { name, description, state } = req.body;

  if (!name) {
    throw new ApiError(400, "Task name is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 1. Create the task
  const task = await Task.create({
    name: name.trim(),
    description: description?.trim() || "",
    state,
    owner: user._id,
  });

  // 2. Push task ID to user's tasks array
  user.tasks.push(task._id);
  await user.save(); // ✅ Important

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { name, description, state } = req.body;

  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.name = name?.trim() || task.name;
  task.description = description?.trim() || task.description;
  task.state = state || task.state;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Remove task._id from user's tasks array
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { tasks: task._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({});

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks,
      },
      "Tasks fetched successfully"
    )
  );
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
