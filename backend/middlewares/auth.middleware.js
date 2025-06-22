import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import User from "../models/User";
export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decodedToken.userId;
    const user = await User.findById(req.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError("Invalid token. Please log in again.", 401);
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError("Your token has expired. Please log in again.", 401);
    }
    throw error;
  }
};
