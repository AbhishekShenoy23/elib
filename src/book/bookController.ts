import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";

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

export { createBooks };
