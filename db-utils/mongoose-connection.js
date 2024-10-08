import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const localUrl = "127.0.0.1:27017";
const dbName = "visioncare-eye-hospital";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// const url = `mongodb://${localUrl}/${dbName}`;

export const connectVaiMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected vai mongoose");
  } catch (e) {
    console.log("Error in connecting to DB", e);
    process.exit();
  }
};
