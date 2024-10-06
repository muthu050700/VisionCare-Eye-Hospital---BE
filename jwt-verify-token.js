import jwt from "jsonwebtoken";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTXV0aHVrdW1hcmFuIiwiYWdlIjoyNSwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTcyODIxNDkwNSwiZXhwIjoxNzI4MjE1MjA1fQ.i0rlYsNaFOJACfiCMjvlG69sxLeQiCOHsl2Ddq73LVQ";

const payload = jwt.verify(token, "muthukumaran", (err, decodedPayload) => {
  if (err) {
    console.log(err);
  } else {
    console.log(decodedPayload);
  }
});
