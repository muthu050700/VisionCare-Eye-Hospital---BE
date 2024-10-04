import mongoose from "mongoose";

const localUrl = "127.0.0.1:27017";
const dbName = "visioncare-eye-hospital";

const cloudDb = `mongodb+srv://muthukumaran050700:a27diYD87N0ine5v@cluster0.3jsis.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// const mongooseUrl = `mongodb://${localUrl}/${dbName}`;

export const connectVaiMongoose = async () => {
  try {
    await mongoose.connect(cloudDb);
    console.log("Connected vai mongoose");
  } catch (e) {
    console.log("Error in connecting to DB", e);
    process.exit();
  }
};
