const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");
const {
  getAllEmails,
  registeredEmails,
} = require("../utils/googleSheetReader");
const data = require("../assets/data.json");
const { db } = require("../db");

let status = false;
let index = 0;
let timer = null;

const startUpload = () => {
  console.log({ time: index, val: data[index] });

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
      db.collection("event")
        .doc("start")
        .update({ stop: true, startedAt: Date.now(), lastUpdated: Date.now() });

      clearInterval(timer);
      return;
    }
    console.log({ time: index, val: data[index] });

    db.collection("values").add({ time: index, val: data[index++] });
  }, 1.5 * 60 * 1000);
};

Router.use(
  authController.verifyToken,
  authController.protect,
  authController.restrictToAdmin
);

Router.post(
  "/start",
  catchAsync(async (req, res, next) => {
    if (status) return res.send("Already started");

    status = true;
    startUpload();

    res.send("Started");
  })
);

Router.post(
  "/stop",
  catchAsync(async (req, res, next) => {
    if (timer) {
      clearInterval(timer);
      timer = null;

      db.collection("event")
        .doc("start")
        .update({ pause: true, lastUpdated: Date.now() });
    } else {
      return res.send("Already Stopped");
    }
    status = false;

    res.send("Stopped");
  })
);

Router.get(
  "/refresh",
  catchAsync(async (req, res, next) => {
    await getAllEmails();

    res.send("Refreshed");
  })
);

Router.get("/registered", async (req, res, next) => {
  res.send(registeredEmails());
});

module.exports = Router;
