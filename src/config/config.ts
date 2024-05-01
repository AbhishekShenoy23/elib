import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  mongoDB: process.env.MONGODB_CONNECTION_URL,
  env: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
  cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config); //this will  make _config read Only
