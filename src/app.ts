import express, { NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import createHttpError from "http-errors";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  //const error = createHttpError(500, "Invalid");
  //throw error;
  console.log("GET Request from Home");
  res.status(200).json({ message: "Hello from Home" });
});

//User Routes
app.use("/api/users", userRouter);

//Book Router
app.use("/api/books", bookRouter);

//Global Error Handler- this will be written at the end.
app.use(globalErrorHandler);

export default app;
