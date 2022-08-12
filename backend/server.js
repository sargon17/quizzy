if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const path = require("path");

app.use(
  cors({
    origin: "*",
    credentials: true,
    "Access-Control-Allow-Origin": "*",
  })
);

const userRouter = require("./routes/user");
const quizRouter = require("./routes/api/quiz");

// POST method route override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/user", userRouter);
app.use("/api/quiz", quizRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
