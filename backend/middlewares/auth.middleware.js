import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  let token = req.cookies.accessToken;

  // Optional: also check Authorization header
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized – No token provided");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token. Please log in again.");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please log in again.");
    }
    throw new ApiError(401, "Authentication failed.");
  }
};
