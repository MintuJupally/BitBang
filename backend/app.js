const cors = require("cors");
const express = require("express");

const requestLogger = require("./utils/requestLogger");

const app = express();
app.use(cors());

app.use(requestLogger);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
