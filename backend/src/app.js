import express from "express";
import router from "./routes/user.route.js";
import cors from "cors";
import CookieParser from "cookie-parser";
const app = express();
const userRouter = router;
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(CookieParser());
app.use("/api/v1/users", userRouter);

export default app;
