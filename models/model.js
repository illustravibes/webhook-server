const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model("Data", dataSchema);
