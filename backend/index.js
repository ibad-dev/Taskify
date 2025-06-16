import { dbConnect } from "./db/index.js";
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests made from this IP, Please try again later 🙂",
});

//Security Middlewares:
app.use(helmet());
app.use("/api", limiter);
app.use(mongoSanitize());

// CORS Configuration:
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body Parser middlewares:
app.use(urlencoded());
app.use(express.static("/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//API  Routes:
import healthCheckRouter from "./routes/healthCheck.route.js";

// Routes:
app.use("/api/v1/healthcheck", healthCheckRouter);

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Is Running on PORT: ${port}..........`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Error", err);
  });
