import express from "express";
import { db } from "../db-utils/db-connection.js";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
// import { v4 } from "uuid";
// import userVerifyToken from "../middlewares/authMiddleware.js";
// import authorizeRoles from "../middlewares/roleMiddleware.js";
const doctorAppointmentRouter = express.Router(); //creating a router

const bookAppointment = db.collection("book-appointment"); //optimization

//get a specific appointments for doctors

doctorAppointmentRouter.get(
  "/:id",
  userVerifyToken,
  authorizeRoles(
    "doctor",
    "Optometrist",
    "Ophthalmologist",
    "Surgeon",
    "Consultant"
  ),
  async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const appointments = await bookAppointment
      .find({ doctorId: id }, { projection: { _id: 0 } }, {})
      .toArray();
    console.log(appointments);
    res.json({ msg: "Appointments for you", appointments });
  }
);

export default doctorAppointmentRouter;
