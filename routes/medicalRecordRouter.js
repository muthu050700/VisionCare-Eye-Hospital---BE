import express from "express";
import { db } from "../db-utils/db-connection.js";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { v4 } from "uuid";
const medicalRecordRouter = express.Router(); //creating a router

const medicalRecords = db.collection("medical-records"); //optimization

medicalRecordRouter.get("/", async (req, res) => {
  const data = await medicalRecords
    .find({}, { projection: { _id: 0 } }, {})
    .toArray();
  console.log(data);
  res.json(data);
});

medicalRecordRouter.get("/patient-records/:id", async (req, res) => {
  const id = req.params.id;
  const data = await medicalRecords.findOne({ id });

  console.log(data);
  res.json(data);
});

//create a patient records
medicalRecordRouter.post("/patient-records", async (req, res) => {
  const medicalDetails = req.body;
  const medicalData = medicalDetails.patientData;
  const doctorId = medicalDetails.doctorId;
  const id = v4();
  await medicalRecords.insertOne({
    id: id,
    ...medicalData,
    doctorId,
  });

  return res.status(200).json({ msg: "medical records created successfully" });
});

medicalRecordRouter.put("/patient-records/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const userDetails = req.body;
  console.log(userDetails);
  // Checking wheather the user data exists or not

  const user = await medicalRecords.findOne({ id });
  console.log(user);
  // if (role.role === user.role) {
  //   res.status(409).json({ msg: "user role is already updated" });
  // } else

  if (user) {
    delete userDetails._id;
    try {
      await medicalRecords.updateOne(
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
  } else {
    res.status(404).json({ msg: "user not found" });
  }
});

//give access

medicalRecordRouter.post("/give-access", async (req, res) => {
  const updateDetails = req.body;
  const doctorDetails = updateDetails.doctors;

  const doctorId = updateDetails.doctorId;
  const id = updateDetails.patientId;
  const doctorIndex = doctorDetails.findIndex((val) => val.id === doctorId);
  const doctorName = doctorDetails[doctorIndex].fullName;
  console.log(doctorName);
  const patientRecord = await medicalRecords.findOne({ id });

  if (!patientRecord) {
    return res.status(404).json({ msg: "Patient record not found" });
  }

  if (id === patientRecord) {
    return res
      .status(409)
      .json({ msg: "The doctor have already access to this patient record" });
  }

  medicalRecords.updateOne(
    { id },
    {
      $set: {
        doctorId,
        doctorName,
      },
    }
  );

  res.status(200).json({ msg: "access given successfully" });
});

export default medicalRecordRouter;
