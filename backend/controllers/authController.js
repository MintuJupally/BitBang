const dotenv = require("dotenv");
dotenv.config();
const AppError = require("../utils/appError");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { db, auth } = require("../db");
const { OAuth2Client } = require("google-auth-library");
const catchAsync = require("../utils/catchAsync");

// const app = initializeApp();

const client = new OAuth2Client(process.env.CLIENT_ID);

exports.verifyToken = catchAsync(async (req, res, next) => {
	console.log(req.body);
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
	const user = await db.collection("users").doc(req.user.id).get();

	if (!user) return next(new AppError("User not found", 404));
	req.user = user;

	next();
});

exports.login = catchAsync(async (req, res, next) => {
	let user = await db.collection("users").doc(req.user.id).get();

	if (!user.exists) {
		// create user
		await db.collection("users").doc(req.user.id).set({
			email: req.user.email,
			wallet: 1000000,
		});

		user = {
			email: req.user.email,
			wallet: 1000000,
		};
	} else {
		user = user.data();
	}
	// req.user = user;
	res.send(user);
});
