import express from "express";
import router from "./routes/user.route.js";
import cors from "cors";
import CookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandling.middleware.js";
import "./config/env.js";

const app = express();
const userRouter = router;
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(CookieParser());
app.use("/api/v1/users", userRouter);
app.use("/", errorHandler);

export default app;
