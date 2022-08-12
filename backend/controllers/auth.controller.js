/*jslint es6 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signup = async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  try {
    await user.save();
    res.status(200).send({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    // if (!user) {
    //   return res.status(401).send({ message: "Invalid email or password." });
    // }
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }
    const passwordCheck = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordCheck) {
      return res
        .status(401)
        .send({ accessToken: null, message: "Invalid email or password." });
    }
    const token = jwt.sign({ _id: user._id }, process.env.API_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
      accessToken: token,
      message: "User signed in successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
