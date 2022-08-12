/*jslint es6 */
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = function (req, res, next) {
  "use strict";
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.API_SECRET,
      function (err, decode) {
        "use strict";
        if (err) req.user = undefined;
        User.findOne({
          _id: decode._id,
        }).exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err.message });
          } else {
            req.user = user;
            next();
          }
        });
      }
    );
  } else {
    req.user = undefined;
    next();
  }
};

module.exports = verifyToken;
