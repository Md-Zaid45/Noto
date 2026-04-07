import connectDB from "./DB/connection.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("app is listening to port :", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("DB connection failed", error);
  });
