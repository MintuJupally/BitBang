const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { db } = require("../db");

exports.performTransaction = catchAsync(async (req, res, next) => {
  const { money, coins, curr, type } = req.body;

  console.log(req.body);

  if (!money || !coins || !curr || !type)
    return next(new AppError("Bad request", 400));

  await db
    .collection("transactions")
    .add({ user: req.user.id, money, coins, curr, type, time: Date.now() });

  console.log({
    wallet: req.user.wallet,
    money,
    diff: req.user.wallet - money,
  });

  await db
    .collection("users")
    .doc(req.user.id)
    .update({ wallet: req.user.wallet + type * money });

  res.send("Transaction successful");
});
