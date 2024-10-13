import express from "express";
import { db } from "../db-utils/db-connection.js";
import userVerifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const userProfileUpdateRoute = express.Router(); //creating a router

const usersCollection = db.collection("users"); //optimization

userProfileUpdateRoute.put("/user-profile-update/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const userDetails = req.body;
  console.log(userDetails);
  // Checking wheather the user data exists or not

  const user = await usersCollection.findOne({ id });
  console.log(user);

  if (user) {
    // delete userDetails._id;
    try {
      await usersCollection.updateOne(
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

export default userProfileUpdateRoute;
