import express from "express";
// import patientRouter from "./routes/patient-Router.js";
import { connectToDb } from "./db-utils/db-connection.js";
import { connectVaiMongoose } from "./db-utils/mongoose-connection.js";
import patientRouter from "./routes/patient.js";

const server = express();

server.use(express.json());

const PORT = 4500;

server.use("/patients", patientRouter);

//Top level module await
// await connectToDb();

await connectVaiMongoose();

server.listen(PORT, () => {
  console.log("The server is running on", PORT);
});
