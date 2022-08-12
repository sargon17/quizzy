/*jslint es6 */
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  "use strict";
  res.header(200).json({
    message: "Welcome to the API",
  });
});

module.exports = router;
