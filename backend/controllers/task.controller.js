import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Task from "../models/Tasks.js";

const createTask = asyncHandler(async (req, res) => {
  const { name, description, state } = req.body;


  if (!name ) {
    throw new ApiError(400, "Task name is required");
  }


  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  
  const task = await Task.create({
    name: name.trim(),
    description: description?.trim() || "",
    state,
    owner: user._id,
  });

 
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
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const { search = "", state, sort = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

  const query = {
    owner: req.user._id,
  };

  // Optional search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Optional filter by state
  if (state && ["Pending", "Active", "Finished"].includes(state)) {
    query.state = state;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  const tasks = await Task.find(query)
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  const total = await Task.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: Number(page),
      limit: Number(limit),
      tasks,
    }, "Tasks fetched successfully")
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



export {  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask, };
