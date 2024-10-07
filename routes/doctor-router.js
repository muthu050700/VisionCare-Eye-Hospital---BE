import express from "express";
import { v4 } from "uuid";
import { db } from "../db-utils/db-connection.js";
import bcrypt from "bcrypt";
import { mailOptions, transporter } from "../utils/mail-utils.js";
import { createJwtToken } from "../utils/jwt-utils.js";
import jwt from "jsonwebtoken";
import { use } from "bcrypt/promises.js";

const doctorRouter = express.Router(); //creating a router

const doctorCollection = db.collection("doctors"); //optimization

//Get all the patient data

doctorRouter.get("/", async (req, res) => {
  const doctorData = await doctorCollection
    .find({}, { projection: { _id: 0 } }, {})
    .toArray();
  console.log(doctorData);
  res.json(doctorData);
});

//create a patient data

doctorRouter.post("/", async (req, res) => {
  const doctorDetails = req.body;
  // checking email id for user wheather user exist or not
  const patient = await doctorCollection.findOne({
    email: doctorDetails.email,
  });
  if (patient) {
    return res
      .status(409)
      .json({ msg: "Patient profile already exists", status: 409 });
  } else {
    bcrypt.hash(doctorDetails.password, 10, async (err, hash) => {
      try {
        doctorDetails.password = hash;
        await doctorCollection.insertOne({
          doctorId: v4(),
          ...doctorDetails,
          isVerified: false,
          isLoggedIn: false,
        });
        //token
        const token = createJwtToken({ email: doctorDetails.email }, "1d");
        console.log(token);

        const link = `${process.env.FE_URL}/verify-account?token=${token}`;
        //sending a mail
        await transporter.sendMail({
          ...mailOptions,
          to: doctorDetails.email,
          subject: `Welcome to the Application ${doctorDetails.fullName}`,
          text: `Hi ${doctorDetails.fullName},\n Thankyou for registering with us. \n To verify your account, click here ${link}`,
        });
        return res
          .status(201)
          .json({ msg: "Doctor data created successfully", status: 201 });
      } catch (e) {
        console.log("Error", e);
      }
    });
  }
});

//delete a patient data

doctorRouter.delete("/", async (req, res) => {
  const doctorId = req.query.id;

  //Checking wheather the patient data exists or not

  const doctor = await doctorCollection.findOne({ patientId });

  if (doctor) {
    await doctorCollection.deleteOne({ doctorId });
    res.json({ msg: "Patient data deleted successfully" });
  } else {
    res.status(404).json({ msg: "patient not found" });
  }
});

//update patient profile

doctorRouter.put("/:id", async (req, res) => {
  const doctorId = req.params.id;
  const updateDetails = req.body;

  //Checking wheather the patient data exists or not

  const doctor = await doctorCollection.findOne({ doctorId });

  if (doctor) {
    await doctorCollection.updateOne(
      { doctorId },
      {
        $set: {
          ...updateDetails,
        },
      }
    );
    res.json({ msg: "Doctor data updated successfully" });
  } else {
    res.status(404).json({ msg: "doctor not found" });
  }
});

//verifying the token

doctorRouter.get("/verify-account", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      res
        .status(400)
        .json({ msg: "Link seems to be expired, please try again " });
    }

    const { email } = data;
    await doctorCollection.updateOne(
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

doctorRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await doctorCollection.findOne({ email });

    if (doctor) {
      bcrypt.compare(password, doctor.password, (err, result) => {
        if (err) {
          console.log(e);
          res.status(400).json({ msg: "Something went wrong" });
        } else if (result) {
          delete doctor.password;
          const checkingLogged = async () => {
            const { email } = doctor;
            await doctorCollection.updateOne(
              {
                email,
              },
              {
                $set: {
                  isLoggedIn: true,
                },
              }
            );
          };
          checkingLogged();
          res.json({ msg: "user logged In successfully", doctor });
        } else {
          res.status(400).json({ msg: "Invalid credentials" });
        }
      });
    } else {
      res.status(400).json({ msg: "doctor not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

//logout user

doctorRouter.post("/logout", async (req, res) => {
  const { user } = req.body;
  const email = user;
  try {
    const patient = await doctorCollection.findOne({ email });

    if (patient) {
      await doctorCollection.updateOne(
        {
          email,
        },
        {
          $set: {
            isLoggedIn: false,
          },
        }
      );
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default doctorRouter;
