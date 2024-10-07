import express from "express";
import { db } from "../db-utils/db-connection.js";
import { v4 } from "uuid";
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

//create a appointment user data

appointmentRouter.post("/", async (req, res) => {
  const appointmentDetails = req.body;

  await bookAppointment.insertOne({
    id: v4(),
    ...appointmentDetails,
  });
  res.status(200).json({ msg: "appointment booked successfully" });
});
