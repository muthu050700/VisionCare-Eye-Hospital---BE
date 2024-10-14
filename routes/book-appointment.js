import express from "express";
import { db } from "../db-utils/db-connection.js";
import { v4 } from "uuid";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
const appointmentRouter = express.Router(); //creating a router

export const bookAppointment = db.collection("book-appointment"); //optimization

//Get all the patient data

appointmentRouter.get("/", async (req, res) => {
  const appointmentData = await bookAppointment
    .find({}, { projection: { _id: 0 } }, {})
    .toArray();
  console.log(appointmentData);
  res.json(appointmentData);
});

//get a specific appointments for doctors

appointmentRouter.get("/doctor/appointments/:id", async (req, res) => {
  const doctorId = req.params.doctorId;

  const appointments = await bookAppointment.find({ doctorId }).toArray();
});

//create a appointment user data

//Ensured only patient can book the appointment
appointmentRouter.post(
  "/",
  userVerifyToken,
  authorizeRoles("patient"),
  async (req, res) => {
    const appointmentDetails = req.body;
    const formDetails = appointmentDetails.formData;
    const patientId = appointmentDetails.patientId;
    try {
      await bookAppointment.insertOne({
        id: v4(),
        ...formDetails,
        patientId,
      });
      return res.status(200).json({ msg: "Appointment booked successfully" });
    } catch (e) {
      console.log(e);
      return res.json({ msg: "There is some error" });
    }
  }
);

// get the appointsment for the paitent to see the status
appointmentRouter.get("/appointment-status/:id", async (req, res) => {
  const id = req.params.id;
  const appointmentData = await bookAppointment
    .find({ patientId: id }, { projection: { _id: 0 } }, {})
    .toArray();
  res.json(appointmentData);
});

//reschedule the appointment by patient

appointmentRouter.put(
  "/patient/reschedule/:id",
  userVerifyToken,
  authorizeRoles("patient"),
  async (req, res) => {
    const id = req.params.id;
    const userDetails = req.body;
    console.log(userDetails, id);
    const user = await bookAppointment.findOne({ id });

    if (user) {
      try {
        delete user.appointmentDate;
        delete user.appointmentTime;
        const updatedUser = { ...user };
        console.log(updatedUser);
        await bookAppointment.updateOne(
          { id },
          {
            $set: {
              ...userDetails,
              status: "pending",
            },
          }
        );
        await bookAppointment.updateOne(
          { id },
          {
            $unset: {
              appointmentDate: 1,
              appointmentTime: 1,
            },
          }
        );
        return res.json({
          msg: "user data updated successfully",
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
);

//update the status by doctor

appointmentRouter.put("/doctor/update-status/:id", async (req, res) => {
  const id = req.params.id;
  const userDetails = req.body;
  console.log(userDetails, id);
  const user = await bookAppointment.findOne({ id });

  if (user) {
    try {
      delete user.appointmentDate;
      delete user.appointmentTime;
      const updatedUser = { ...user };
      console.log(updatedUser);
      await bookAppointment.updateOne(
        { id },
        {
          $set: {
            ...userDetails,
          },
        }
      );
      return res.json({
        msg: "user data updated successfully",
      });
    } catch (e) {
      console.log(e);
    }
  }
});

//cancelling the appointment by patient

appointmentRouter.put(
  "/patient/cancel/:id",
  userVerifyToken,
  authorizeRoles("patient"),
  async (req, res) => {
    const id = req.params.id;
    const userDetails = {
      status: "Appointment cancelled",
    };
    console.log(userDetails, id);
    const user = await bookAppointment.findOne({ id });

    if (user) {
      try {
        delete user.appointmentDate;
        delete user.appointmentTime;
        const updatedUser = { ...user };
        console.log(updatedUser);
        await bookAppointment.updateOne(
          { id },
          {
            $set: {
              ...userDetails,
            },
          }
        );
        await bookAppointment.updateOne(
          { id },
          {
            $unset: {
              appointmentDate: 1,
              appointmentTime: 1,
              rescheduledDate: 1,
              rescheduledTime: 1,
            },
          }
        );
        return res.json({
          msg: "Appointment cancelled successfully",
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
);

//assign appointments

appointmentRouter.put("/assign-appointments/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const data = req.body;
  const doctorId = data.doctorId;
  const user = await bookAppointment.findOne({ id });

  if (user) {
    try {
      await bookAppointment.updateOne(
        { id },
        {
          $set: {
            doctorId,
          },
        }
      );
      return res.json({
        msg: "doctor assigned successfully",
      });
    } catch (e) {
      console.log(e);
    }
  }
});

export default appointmentRouter;
