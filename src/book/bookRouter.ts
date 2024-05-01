import express from "express";
import { createBooks } from "./bookController";

const bookRouter = express.Router();

bookRouter.post("/createBooks", createBooks);

export default bookRouter;
