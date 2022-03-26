const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { db } = require("../db");

exports.performTransaction = catchAsync(async (req, res, next) => {
  const { money, coins, curr, type, t } = req.body;

  if (!money || !coins || !curr || !type || !t)
    return next(new AppError("Bad request", 400));

  await db
    .collection("transactions")
    .add({ user: req.user.id, money, coins, curr, type, t, time: Date.now() });

  await db
    .collection("users")
    .doc(req.user.id)
    .update({ wallet: req.user.wallet + type * money });

  res.send("Transaction successful");
});
