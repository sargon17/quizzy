/*jslint es6 */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    unique: [true, "Email is already registered"],
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email address!",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  likedQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
