import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

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
  let user;
  try {
    user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, { message: "User Already Exists" });
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, { message: "Error while fetching user" }));
  }

  //Hashing the password .. This will be CPU intensive. should make sure await
  //while hashing there might be a chance that password hashed will be of same type of pattern which will help the hacker to guess password.
  //So we will use salt to make it more secure.

  let newUser;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(
      createHttpError(500, { message: "Error while registering User" })
    );
  }

  try {
    //Token generation.

    const token = jwt.sign({ sub: newUser._id }, config.secretKey as string, {
      expiresIn: "1d",
    });

    res.status(200).json({ accessToken: token });
  } catch (error) {
    return next(
      createHttpError(500, "Error while signing User. Generating token")
    );
  }
};

export { createUser };
