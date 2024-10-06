import jwt from "jsonwebtoken";

const obj = {
  name: "Muthukumaran",
  age: 25,
  role: "developer",
};

console.log(
  jwt.sign(obj, "muthukumaran", {
    expiresIn: "5m",
    // expiresIn: "5s", // five second
    // expiresIn: "5d", // five days
    // expiresIn: "5h", // five hours
  })
);
