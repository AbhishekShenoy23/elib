import express from "express";
import path from "node:path";
import {
  createBooks,
  deleteBook,
  updateBooks,
  bookList,
  singleBook,
} from "./bookController";
import multer from "multer";
import authenticate from "../middleware/authenticate";

const bookRouter = express.Router();

//multer will first store file in server file system and then we will move file to cloud.

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBooks
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBooks
);

bookRouter.delete("/:bookId", authenticate, deleteBook);

bookRouter.get("/", bookList);

bookRouter.get("/:bookId", singleBook);

export default bookRouter;
