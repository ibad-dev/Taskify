import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnect } from "./db/index.js";

// Import Routes
import healthCheckRouter from "./routes/healthCheck.route.js";
import UserRouter from "./routes/user.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// ✅ Security Middlewares
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests made from this IP. Please try again later 🙂",
  })
);

// ✅ CORS Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Body Parsing Middleware (most important!)
app.use(express.json()); // <-- this is what was missing!
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Static Files (if needed)
app.use(express.static("public")); // "public", not "/public"

// ✅ Routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", UserRouter);

// ✅ DB + Server
dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on PORT ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
