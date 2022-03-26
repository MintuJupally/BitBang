const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController");
const tradeController = require("../controllers/tradeController");

Router.use(authController.verifyToken, authController.protect);

Router.post("/", tradeController.performTransaction);

module.exports = Router;
