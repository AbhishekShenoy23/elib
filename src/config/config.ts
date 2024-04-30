import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
};

export const config = Object.freeze(_config); //this will  make _config read Only
