import express, { NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import createHttpError from "http-errors";
import userRouter from "./user/userRouter";

const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  const error = createHttpError(500, "Invalid");
  throw error;
  console.log("GET Request from Home");
  res.status(200).json({ message: "Hello from Home" });
});

app.use("/api/users", userRouter);

//Global Error Handler- this will be written at the end.
app.use(globalErrorHandler);

export default app;
