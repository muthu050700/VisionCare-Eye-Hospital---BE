import express from "express";
import { db } from "../db-utils/db-connection.js";
import { v4 } from "uuid";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
const appointmentRouter = express.Router(); //creating a router

const bookAppointment = db.collection("book-appointment"); //optimization

//Get all the patient data

appointmentRouter.get("/", async (req, res) => {
  const appointmentData = await bookAppointment
    .find({}, { projection: { _id: 0 } }, {})
    .toArray();
  console.log(appointmentData);
  res.json(appointmentData);
});

export default appointmentRouter;

//get a specific appointments for doctors

appointmentRouter.get("/doctor/appointments/:id", async (req, res) => {
  const doctorId = req.params.doctorId;

  const appointments = await bookAppointment.find({ doctorId }).toArray();

  console.log(appointments);
});

//create a appointment user data

appointmentRouter.post(
  "/",
  userVerifyToken,
  authorizeRoles("patient"),
  async (req, res) => {
    const appointmentDetails = req.body;
    console.log(appointmentDetails);
    await bookAppointment.insertOne({
      id: v4(),
      ...appointmentDetails,
    });
    res.status(200).json({ msg: "appointment booked successfully" });
  }
);
