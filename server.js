require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;
const incidentRouter = require("./routes/incidentRouter.js");
const accidentRouter = require("./routes/accidentRouter.js");

const connectOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  poolSize: 50,
  wtimeout: 2500,
};
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log(`Error: ${err}`);
  console.log(`Connected to MongoDB`);
});

const server = express();
server.use(express.json());
server.use(cors({ origin: "http://localhost:3000" }));
server.use(function (req, res, next) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});
server.get("/", (req, res) => res.send("API Running..."));
server.listen(PORT, () => console.log(`\n\nAPI running on port ${PORT}`));

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message });
}

server.use("/api/accidents", accidentRouter);
server.use("/api/incidents", incidentRouter);
server.use(logErrors);
server.use(errorHandler);

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});