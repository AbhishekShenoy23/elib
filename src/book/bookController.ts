import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import { authRequest } from "../middleware/authenticate";

const createBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let uploadFiles, uploadBookResult;

    const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1];

    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/",
      fileName
    );

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/",
      bookFileName
    );

    try {
      //cover images upload to the cloudinary folder

      //book file upload to the cloudinary folder
      uploadFiles = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-covers",
        format: coverImageMimeType,
      });
    } catch (error) {
      console.log("book-covers", error);
    }

    try {
      uploadBookResult = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        format: "pdf",
        filename_override: bookFileName,
        folder: "book-files",
      });
    } catch (error) {
      console.log("book-files", error);
      return next(
        createHttpError(500, {
          message: "Error while uploading to cloud",
          error: error,
        })
      );
    }

    //create book file in DB
    let newBook;
    try {
      newBook = await bookModel.create({
        title,
        genre,
        author: "663118305f7fc3b1e651e38a",
        coverImage: uploadFiles?.secure_url,
        file: uploadBookResult.secure_url,
      });
    } catch (error) {
      return next(
        createHttpError(500, { message: "Failed to create Book Entry in  db" })
      );
    }

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({
      bookId: newBook._id,
      message: "Book Created",
      uploadFiles,
      uploadBookResult,
    });
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, { message: "Failed to create Book Entry" })
    );
  }
};

const updateBooks = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const { title, genre } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log("REQ.files", files);
  let uploadFiles, uploadBookResult;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError("404", { message: "Invalid book " }));
  }

  const _req = req as authRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, { message: "Unauthorized" }));
  }

  let updatedCoverURL = "";
  if (files.coverImage) {
    console.log("Cover image");
    const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1];

    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/",
      fileName
    );
    uploadFiles = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    updatedCoverURL = uploadFiles.secure_url;
    await fs.promises.unlink(filePath);
  }

  let updatedBookUrl = "";
  if (files.file) {
    console.log("File");
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/",
      bookFileName
    );
    uploadBookResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      format: "pdf",
      filename_override: bookFileName,
      folder: "book-files",
    });
    updatedBookUrl = uploadBookResult.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  console.log("Uploading cover", updatedCoverURL);
  console.log("Uploading File", updatedBookUrl);

  const updatedBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title,
      genre,
      coverImage: updatedCoverURL ? updatedCoverURL : book.coverImage,
      file: updatedBookUrl ? updatedBookUrl : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError("404", { message: "Invalid book " }));
    }

    //check if authorized to delete book.

    const _req = req as authRequest;

    if (book.author.toString() !== _req.userId) {
      return next(createHttpError("500", { message: "UnAuthorized" }));
    }

    // before deleting from DB .. Need to delete from cloudinary.
    //https://res.cloudinary.com/dsqigsjax/image/upload/v1714582578/book-covers/pwpgvfrneqhiixdkz5vv.jpg
    //https://res.cloudinary.com/dsqigsjax/raw/upload/v1714582579/book-files/gh2hxt8bihwcslxopcg8.pdf

    const coverImage_public = `${book.coverImage.split("/").at(-2)}/${
      book.coverImage.split("/").at(-1)?.split(".")[0]
    }`;
    console.log(coverImage_public);

    await cloudinary.uploader.destroy(
      coverImage_public,
      function (error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log(result);
        }
      }
    );

    //

    res.json({});
  } catch (error) {}
};

const bookList = async (req: Request, res: Response, next: NextFunction) => {
  const books = await bookModel.find({});

  res.json({ books });
};

const singleBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  res.status(200).json({ book });
};

export { createBooks, updateBooks, deleteBook, bookList, singleBook };
