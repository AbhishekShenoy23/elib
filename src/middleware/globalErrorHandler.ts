import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorStatus = err.statusCode || 500;
  const message = err.message;
  const errorStack = config.env !== "production" ? err.stack : "";

  res.status(errorStatus).json({ message: message, stack: errorStack });
};
