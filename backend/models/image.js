const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: String,
  image: {
    type: Buffer,
    contentType: String,
  },
});
