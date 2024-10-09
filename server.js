import express from "express";
// import patientRouter from "./routes/patient-Router.js";
import { connectToDb } from "./db-utils/db-connection.js";
import { connectVaiMongoose } from "./db-utils/mongoose-connection.js";
import patientRouter from "./routes/patient-Router.js";
import cors from "cors";
import appointmentRouter from "./routes/book-appointment.js";
import doctorRouter from "./routes/doctor-router.js";
import authRouter from "./routes/authRouter.js";

const server = express();

server.use(express.json());
server.use(cors());
const PORT = 4500;

server.use("/patients", patientRouter);
server.use("/doctors", doctorRouter);
server.use("/book-appointment", appointmentRouter);
server.use("/auth-router", authRouter);
//Top level module await
await connectToDb();

// await connectVaiMongoose();

server.listen(PORT, () => {
  console.log("The server is running on", PORT);
});
