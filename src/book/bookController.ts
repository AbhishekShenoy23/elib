import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBooks = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let uploadFiles, uploadBookResult;

  try {
    //cover images upload to the cloudinary folder
    const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1];
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/",
      fileName
    );

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
  } catch (error) {
    console.log("book-files", error);
  }

  res.status(201).json({
    message: "Book Created",
    uploadFiles,
    uploadBookResult,
  });
};

export { createBooks };
