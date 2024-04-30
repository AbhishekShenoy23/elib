import express from "express";
import { createUser } from "./userController";

const userRouter = express.Router();

//handle Routes
userRouter.post("/register", createUser);
export default userRouter;
