import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();
// const url = "mongodb://127.0.0.1:27017";
const dbName = "visioncare-eye-hospital";
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

export const client = new mongodb.MongoClient(url);

export const db = client.db(dbName);

export const connectToDb = async () => {
  try {
    await client.connect();
    console.log("DB connected successfully");
  } catch (e) {
    console.log("Error in connecting to DB", e);
    process.exit();
  }
};
