import express from "express";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { db } from "../db-utils/db-connection.js";
import { createJwtToken } from "../utils/jwt-utils.js";
import bcrypt from "bcrypt";
const adminRoute = express.Router();
const userCollection = db.collection("users"); //optimization

//get all the user api

adminRoute.get(
  "/users",
  userVerifyToken,
  authorizeRoles("admin", "cataracts", "glaucoma", "macular degeneration"),
  async (req, res) => {
    const data = await userCollection
      .find({}, { projection: { _id: 0 } }, {})
      .toArray();
    console.log(data);

    res.json(data);
  }
);

//update the role of the doctor

adminRoute.put(
  "/updateRole/:id",
  userVerifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const userDetails = req.body;
    // Checking wheather the user data exists or not

    const user = await userCollection.findOne({ id });
    console.log(user);
    // if (role.role === user.role) {
    //   res.status(409).json({ msg: "user role is already updated" });
    // } else

    if (user) {
      bcrypt.hash(userDetails.password, 10, async (err, hash) => {
        try {
          userDetails.password = hash;
          await userCollection.updateOne(
            { id },
            {
              $set: {
                ...userDetails,
              },
            }
          );
          const updatedUser = await userCollection.findOne({ id });
          console.log(updatedUser);
          const updatedToken = createJwtToken(
            {
              email: updatedUser.email,
              role: updatedUser.role,
              id: updatedUser.id,
            },
            "1d"
          );
          console.log(updatedToken);
          return res.json({
            msg: "user data updated successfully",
            updatedToken,
          });
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      res.status(404).json({ msg: "user not found" });
    }
  }
);

// delete the user

adminRoute.delete(
  "/delete",
  userVerifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const id = req.query.id;
    console.log(id);
    // Checking wheather the user data exists or not

    const user = await userCollection.findOne({ id });

    if (user) {
      await userCollection.deleteOne({ id });
      res.json({ msg: "user data deleted successfully" });
    } else {
      res.status(404).json({ msg: "user not found" });
    }
  }
);

export default adminRoute;
