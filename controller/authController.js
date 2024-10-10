import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db-utils/db-connection.js";
import { createJwtToken } from "../utils/jwt-utils.js";
import { mailOptions, transporter } from "../utils/mail-utils.js";

const userCollection = db.collection("users"); //optimization

// Register a user
export const register = async (req, res) => {
  const userDetails = req.body;
  // checking email id for user wheather user exist or not
  const user = await userCollection.findOne({
    email: userDetails.email,
  });
  if (user) {
    return res.status(409).json({
      msg: `${userDetails.fullName} profile already exists`,
      status: 409,
    });
  } else {
    bcrypt.hash(userDetails.password, 10, async (err, hash) => {
      try {
        userDetails.password = hash;
        await userCollection.insertOne({
          id: v4(),
          ...userDetails,
          isVerified: false,
        });
        //token
        const token = createJwtToken({ email: userDetails.email }, "1d");

        const link = `${process.env.FE_URL}/verify-account?token=${token}`;
        //sending a mail
        await transporter.sendMail({
          ...mailOptions,
          to: userDetails.email,
          subject: `Welcome to the Application ${userDetails.fullName}`,
          text: `Hi ${userDetails.fullName},\n Thankyou for registering with us. \n To verify your account, click here ${link}`,
        });
        return res.status(201).json({
          msg: "user data created successfully",
          status: 201,
        });
      } catch (e) {
        console.log("Error", e);
      }
    });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await userCollection.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ msg: "Incorrect password" });
  }

  const tokenLogin = createJwtToken(
    { email: user.email, role: user.role },
    "1d"
  );

  return res.json({ msg: "user logged In successfully", user, tokenLogin });
};
