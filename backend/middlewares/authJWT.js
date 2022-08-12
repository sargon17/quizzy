/*jslint es6 */
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    console.log(req.headers.authorization.split(" ")[1]);

    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.API_SECRET,
      async function (err, decode) {
        console.log(decode);
        if (err) req.user = undefined;
        // console.log("authJWT.js: connected user id -> ", decode._id);
        let user;
        try {
          user = await User.findOne({ _id: decode._id }).exec();
          req.user = user;
          next();
        } catch (err) {
          console.log("authJWT.js: finding user Error ", err);
          res.status(500).json({
            message: err,
          });
        }
      }
    );
  } else {
    req.user = undefined;
    next();
  }
};

module.exports = verifyToken;
