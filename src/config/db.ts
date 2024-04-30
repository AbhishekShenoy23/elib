import mongoose from "mongoose";

import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose is connected");
    });

    mongoose.connection.on("error", (error) => {
      console.log("Mongoose is disconnected. Error in connection", error);
    });

    await mongoose.connect(config.mongoDB as string);
  } catch (err) {
    console.error("failed to connect to database", err);
    process.exit(1);
  }
};

export default connectDB;
