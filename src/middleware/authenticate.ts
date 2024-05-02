import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface authRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Autorization token is required"));
  }

  const parsedToken = token.split(" ")[1];

  const decoded = jwt.verify(parsedToken, config.secretKey as string);
  const _req = req as authRequest;
  _req.userId = decoded.sub as string;
  next();
};

export default authenticate;
