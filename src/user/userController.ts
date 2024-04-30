import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, {
      message: "All Fields are required",
    });
    return next(error);
  }

  //Process the data .. Database Call

  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, { message: "User Already Exists" });
    return next(error);
  }

  res.status(200).json({ message: "Hello from register controller" });
};

export { createUser };
