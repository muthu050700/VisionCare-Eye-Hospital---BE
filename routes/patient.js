// importing model for the patient
import { v4 } from "uuid";
import { patientModel } from "../db-utils/models.js";
import express from "express";
import mongoose from "mongoose";

const patientRouter = express.Router();

//Get all the patient data

patientRouter.get("/", async (req, res) => {
  const patientData = await patientModel.find();
  res.json(patientData);
});

//create a patient data

patientRouter.post("/", async (req, res) => {
  const patientDetails = req.body;
  console.log(patientDetails);
  // validate and insert new record into DB
  const patientObj = new patientModel({
    ...patientDetails,
    patientId: v4(),
    isVerified: false,
  });
  try {
    //this line will validate and insert data into DB
    await patientObj.save();
    res.status(201).json({ msg: "patient data created successfully" });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ msg: "please check all the field is filled" });
    } else {
      res.status(500).json({ msg: "Internal server Error" });
    }
  }
});

//delete a patient data

// patientRouter.delete("/", async (req, res) => {
//   const patientId = req.query.id;

//Checking wheather the patient data exists or not

//   const patient = await patientCollection.findOne({ patientId });

//   if (patient) {
//     await patientCollection.deleteOne({ patientId });
//     res.json({ msg: "Patient data deleted successfully" });
//   } else {
//     res.status(404).json({ msg: "patient not found" });
//   }
// });

//update patient profile

// patientRouter.put("/:id", async (req, res) => {
//   const patientId = req.params.id;
//   const updateDetails = req.body;

//Checking wheather the patient data exists or not

//   const patient = await patientCollection.findOne({ patientId });

//   if (patient) {
//     await patientCollection.updateOne(
//       { patientId },
//       {
//         $set: {
//           ...updateDetails,
//         },
//       }
//     );
//     res.json({ msg: "Patient data updated successfully" });
//   } else {
//     res.status(404).json({ msg: "patient not found" });
//   }
// });

export default patientRouter;
