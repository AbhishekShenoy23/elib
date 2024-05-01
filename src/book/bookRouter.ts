import express from "express";
import path from "node:path";
import { createBooks } from "./bookController";
import multer from "multer";

const bookRouter = express.Router();

//multer will first store file in server file system and then we will move file to cloud.

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBooks
);

export default bookRouter;
