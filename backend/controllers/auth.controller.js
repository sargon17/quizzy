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
  const token = jwt.sign({ _id: user._id }, process.env.API_SECRET, {
    expiresIn: "12h",
  });
  try {
    await user.save();
    res.status(200).json({
      message: "User created successfully!",
      user: user,
      accessToken: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const passwordCheck = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordCheck) {
      return res
        .status(401)
        .json({ accessToken: null, message: "Invalid email or password." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.API_SECRET, {
      expiresIn: "12h",
    });

    res.status(200).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
      accessToken: token,
      message: "User signed in successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
