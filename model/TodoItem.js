// Importing modules
const mongoose = require("mongoose");

// Creating model
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Exporting model
module.exports = mongoose.model("TodoItem", schema);
