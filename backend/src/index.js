import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import connectDB from "./DB/connection.js";
import express from "express";

const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("app is listening to port :", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("DB connection failed", error);
  });
