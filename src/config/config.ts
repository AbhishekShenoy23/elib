import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  mongoDB: process.env.MONGODB_CONNECTION_URL,
  env: process.env.NODE_ENV,
};

export const config = Object.freeze(_config); //this will  make _config read Only
