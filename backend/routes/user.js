/*global jslint es6 */
/*global require*/

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authJWT");

const { signup, signin } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/hiddencontent", verifyToken, (req, res) => {
  "use strict";
  if (!user) {
    res.status(403).send({ message: "Invalid token" });
  }
  res.status(200).send({ message: "This is a secret content" });
});

module.exports = router;
