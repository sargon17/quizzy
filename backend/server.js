if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");

// todo to delete
const formidable = require("formidable");
// const path = require("path");

app.use(
  cors({
    origin: "*",
    credentials: true,
    "Access-Control-Allow-Origin": "*",
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

const userRouter = require("./routes/user");
const quizRouter = require("./routes/api/quiz");
const categoryRouter = require("./routes/api/category");

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

app.post("/upload", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    } else {
      res.status(200).json({
        message: "File uploaded successfully",
        fields,
        files,
      });
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
