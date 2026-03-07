import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${DB_NAME}`,
    );
    console.log(
      " DB connected successfully ",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.log("DB connection FAILED ", error);
    process.exit(1);
  }
}
