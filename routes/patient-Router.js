import express from "express";
import { v4 } from "uuid";
import { db } from "../db-utils/db-connection.js";
import bcrypt from "bcrypt";
import { mailOptions, transporter } from "../utils/mail-utils.js";
import { createJwtToken } from "../utils/jwt-utils.js";
import jwt from "jsonwebtoken";

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
      try {
        patientDetails.password = hash;
        await patientCollection.insertOne({
          patientId: v4(),
          ...patientDetails,
          isVerified: false,
        });
        //token
        const token = createJwtToken({ email: patientDetails.email }, "1d");
        console.log(token);

        const link = `${process.env.FE_URL}/verify-account?token=${token}`;
        //sending a mail
        await transporter.sendMail({
          ...mailOptions,
          to: patientDetails.email,
          subject: `Welcome to the Application ${patientDetails.fullName}`,
          text: `Hi ${patientDetails.fullName},\n Thankyou for registering with us. \n To verify your account, click here ${link}`,
        });
        return res
          .status(201)
          .json({ msg: "Patient data created successfully", status: 201 });
      } catch (e) {
        console.log("Error", e);
      }
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

//verifying the token

patientRouter.get("/verify-account", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      res
        .status(400)
        .json({ msg: "Link seems to be expired, please try again " });
    }

    const { email } = data;
    await patientCollection.updateOne(
      {
        email,
      },
      {
        $set: {
          isVerified: true,
        },
      }
    );
    res.json({ msg: "user verified successfully" });
  });
});

//patient login

patientRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await patientCollection.findOne({ email });

    if (patient) {
      bcrypt.compare(password, patient.password, (err, result) => {
        if (err) {
          console.log(e);
          res.status(400).json({ msg: "Something went wrong" });
        } else if (result) {
          delete patient.password;
          res.json({ msg: "user logged In successfully", patient });
        } else {
          res.status(400).json({ msg: "Invalid credentials" });
        }
      });
    } else {
      res.status(400).json({ msg: "patient not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default patientRouter;
