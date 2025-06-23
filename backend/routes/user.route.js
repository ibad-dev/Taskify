import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/create-user").post(registerUser);
router.route("/login-user").post(loginUser);
router.route("/logout-user").post(isAuthenticated, logoutUser);
router.route("/get-user-profile").post(isAuthenticated, getUserProfile);
export default router;
