const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const songRoutes = require("../api/routes/songs");
const artistRoutes = require("../api/routes/artists");

/**
 * Middleware
 */

// logging
app.use(morgan("dev"));

// parsing
app.use(express.urlencoded({ extended: true }));

// parsing JSON requests
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }
  next();
});

// GET request for checking if server is running
app.get("/", (req, res, next) => {
  res.status(201).json({ message: "Service is Up!", method: req.method });
});

// routes
app.use("/songs", songRoutes);
app.use("/artists", artistRoutes);

// error handling middleware
app.use((req, res, next) => {
  const error = new Error("Not Found!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

// connect to mongodb
mongoose.connect(process.env.MONGODBURL, (err) => {
  if (err) {
    console.error("Error: ", err.message);
  } else {
    console.log("MongoDB connection successful");
  }
});

module.exports = app;
