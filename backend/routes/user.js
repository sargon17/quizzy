/*global jslint es6 */
/*global require*/

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authJWT");

const { signup, signin } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/signin", signin);

// router.get("/secret", verifyToken, (req, res) => {
//   "use strict";
//   if (!req.user) {
//     res.status(403).json({ message: "Invalid token" });
//   }
//   res.status(200).json({ message: "This is a secret content" });
// });
router.get("/isAuth", verifyToken, (req, res) => {
  console.log("isAuth");
  ("use strict");
  if (!req.user) {
    res.status(403).json({ message: "Unauthorized", isAuth: false });
  }
  res.status(200).json({ message: "Authorized", isAuth: true });
});

module.exports = router;
