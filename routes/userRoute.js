import express from "express";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { db } from "../db-utils/db-connection.js";

const userRouter = express.Router();
const userCollection = db.collection("users"); //optimization

// get all the users
userRouter.get("/", async (req, res) => {
  const userData = await userCollection
    .find({}, { projection: { _id: 0 } }, {})
    .toArray();
  console.log(userData);
  res.json(userData);
});

//only Admin can access the route
userRouter.get(
  "/admin",
  userVerifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ msg: "Welcome Admin" });
  }
);
//only doctor can access the route
userRouter.get(
  "/doctor",
  userVerifyToken,
  authorizeRoles("doctor"),
  (req, res) => {
    res.json({ msg: "Welcome Doctor" });
  }
);
//only patient can acces the route
userRouter.get(
  "/patient",
  userVerifyToken,
  authorizeRoles("patient"),
  (req, res) => {
    res.json({ msg: "Welcome Patient" });
  }
);

export default userRouter;
