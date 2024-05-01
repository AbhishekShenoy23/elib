import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createBooks = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files);
  res.status(201).json({
    message: "Book Created",
  });
};

export { createBooks };
