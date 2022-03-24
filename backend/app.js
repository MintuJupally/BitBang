const cors = require("cors");
const express = require("express");

const requestLogger = require("./utils/requestLogger");
const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync");

const data = require("./assets/data.json");
const db = require("./db");

const app = express();
app.use(cors());

app.use(requestLogger);

let status = false;
let index = 0;
let timer = null;

const startUpload = () => {
  console.log(data[index]);
  db.collection("values").add({ time: index, val: data[index++] });

  timer = setInterval(() => {
    console.log(data[index]);
    db.collection("values").add({ time: index, val: data[index++] });
  }, 10 * 1000);
};

app.post(
  "/api/start",
  catchAsync(async (req, res, next) => {
    try {
      if (status) return res.send("Already started");

      status = true;
      startUpload();

      res.send("Started");
    } catch (err) {}
  })
);

app.post("/api/stop", async (req, res, next) => {
  try {
    if (timer) {
      clearInterval(timer);
      timer = null;
    } else {
      res.send("Already Stopped");
    }
    status = false;

    res.send("Stopped");
  } catch (err) {}
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
