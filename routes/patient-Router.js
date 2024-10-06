import express from "express";
import { v4 } from "uuid";
import { db } from "../db-utils/db-connection.js";
import bcrypt from "bcrypt";
const patientRouter = express.Router(); //creating a router

const patientCollection = db.collection("patients"); //optimization

//Get all the patient data

patientRouter.get("/", async (req, res) => {
  const patientData = await patientCollection
    .find({}, { projection: { _id: 0 } }, {})
    .toArray();
  console.log(patientData);
  res.json(patientData);
});

//create a patient data

patientRouter.post("/", async (req, res) => {
  const patientDetails = req.body;
  // checking email id for user wheather user exist or not
  const patient = await patientCollection.findOne({
    email: patientDetails.email,
  });
  if (patient) {
    return res
      .status(409)
      .json({ msg: "Patient profile already exists", status: 409 });
  } else {
    bcrypt.hash(patientDetails.password, 10, async (err, hash) => {
      patientDetails.password = hash;
      await patientCollection.insertOne({
        patientId: v4(),
        ...patientDetails,
        isVerified: false,
      });
      return res
        .status(201)
        .json({ msg: "Patient data created successfully", status: 201 });
    });
  }
});

//delete a patient data

patientRouter.delete("/", async (req, res) => {
  const patientId = req.query.id;

  //Checking wheather the patient data exists or not

  const patient = await patientCollection.findOne({ patientId });

  if (patient) {
    await patientCollection.deleteOne({ patientId });
    res.json({ msg: "Patient data deleted successfully" });
  } else {
    res.status(404).json({ msg: "patient not found" });
  }
});

//update patient profile

patientRouter.put("/:id", async (req, res) => {
  const patientId = req.params.id;
  const updateDetails = req.body;

  //Checking wheather the patient data exists or not

  const patient = await patientCollection.findOne({ patientId });

  if (patient) {
    await patientCollection.updateOne(
      { patientId },
      {
        $set: {
          ...updateDetails,
        },
      }
    );
    res.json({ msg: "Patient data updated successfully" });
  } else {
    res.status(404).json({ msg: "patient not found" });
  }
});

export default patientRouter;
