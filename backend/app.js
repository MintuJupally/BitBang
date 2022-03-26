const cors = require("cors");
const express = require("express");

const requestLogger = require("./utils/requestLogger");
const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync");
const adminRouter = require("./routes/adminRoutes");
const authRouter = require("./routes/authRoutes");
const tradeRouter = require("./routes/tradeRoutes");
const globalErrorHandler = require("./controllers/errorController");
const data = require("./assets/data.json");
const { db } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api/auth", authRouter);
app.use("/api/trade", tradeRouter);

app.use("/api/admin", adminRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
