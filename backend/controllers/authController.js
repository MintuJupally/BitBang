const dotenv = require("dotenv");
dotenv.config();

const AppError = require("../utils/appError");
const { db, auth } = require("../db");
const catchAsync = require("../utils/catchAsync");
const { registeredEmails } = require("../utils/googleSheetReader");

exports.verifyToken = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) return next(new AppError("User not logged in.", 403));

  auth
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = { id: decodedToken.uid, email: decodedToken.email };
      next();
    })
    .catch((err) => {
      next(new AppError("User not logged in.", 403));
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  // let user = await User.findOne({ email: req.user.email });
  const doc = await db.collection("users").doc(req.user.id).get();

  if (!doc.exists) return next(new AppError("User not found", 404));
  req.user = { id: doc.id, ...doc.data() };

  next();
});

exports.restrictToAdmin = catchAsync(async (req, res, next) => {
  if (!req.user.admin) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  let user = await db.collection("users").doc(req.user.id).get();

  if (!user.exists) {
    user = {
      email: req.user.email,
    };

    if (
      registeredEmails()
        .map((email) => email.toLowerCase())
        .includes(req.user.email)
    ) {
      // create user
      await db.collection("users").doc(req.user.id).set({
        email: req.user.email,
        wallet: 1000000,
      });

      user.wallet = 1000000;
      user.isRegistered = true;
    } else user.isRegistered = false;
  } else {
    user = { ...user.data(), isRegistered: true };
  }
  // req.user = user;
  res.send(user);
});
