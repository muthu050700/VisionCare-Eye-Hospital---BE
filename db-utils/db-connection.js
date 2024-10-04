import mongodb from "mongodb";

const localUrl = "127.0.0.1:27017";
const dbName = "visioncare-eye-hospital";

export const client = new mongodb.MongoClient(`mongodb://${localUrl}`);

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
