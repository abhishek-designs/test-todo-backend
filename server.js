// Importing modules
// const DBConnect = require("./config/connectDB");
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

// DBConnect(); // Establish connection to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.error(err));

// Initializing app
const app = express();

// Middlewares
app.use(express.json({ extended: true }));
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/todo", require("./routes/todo"));

// listening on the PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
