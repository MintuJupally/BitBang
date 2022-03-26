const cors = require("cors");
const express = require("express");

const requestLogger = require("./utils/requestLogger");
const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync");
const authRouter = require("./routes/authRoutes");
const tradeRouter = require("./routes/tradeRoutes");
const data = require("./assets/data.json");
const { db } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api/auth", authRouter);
app.use("/api/trade", tradeRouter);

let status = false;
let index = 0;
let timer = null;

const startUpload = () => {
  console.log(data[index]);
  db.collection("values").add({ time: index, val: data[index++] });
  if (index <= 1)
    db.collection("event").doc("start").set({
      started: true,
      stop: false,
      pause: false,
      startedAt: Date.now(),
      lastUpdated: Date.now(),
    });

  timer = setInterval(() => {
    if (index === data.length) {
      clearInterval(timer);
      db.collection("event")
        .doc("start")
        .update({ stop: true, startedAt: Date.now(), lastUpdated: Date.now() });
    }
    console.log(data[index]);
    db.collection("values").add({ time: index, val: data[index++] });
  }, 1.5 * 60 * 1000);
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
      index = 0;

      db.collection("event")
        .doc("start")
        .update({ stop: true, lastUpdated: Date.now() });
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
