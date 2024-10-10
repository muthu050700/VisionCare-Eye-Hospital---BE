import express from "express";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const userRouter = express.Router();

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
