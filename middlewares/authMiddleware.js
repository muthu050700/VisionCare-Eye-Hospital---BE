import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userVerifyToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader || authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization is denied" });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;

      console.log("The decoded user is", req.user);
      next();
    } catch (e) {
      res.status(400).json({ msg: "token is not valid" });
    }
  } else {
    return res.status(401).json({ msg: "No token, authorization is denied" });
  }
};

export default userVerifyToken;
