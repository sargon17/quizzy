if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "*",
    credentials: true,
    "Access-Control-Allow-Origin": "*",
  })
);

const userRouter = require("./routes/user");
const quizRouter = require("./routes/api/quiz");
const categoryRouter = require("./routes/api/category");
const subCategoryRouter = require("./routes/api/sub_category");
const questionRouter = require("./routes/api/Q&A");

// POST method route override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
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
app.use("/api/category", categoryRouter);
app.use("/api/sub_category", subCategoryRouter);
app.use("/api/qa", questionRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
