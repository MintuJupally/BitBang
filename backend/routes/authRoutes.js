const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController");

Router.post("/login", authController.verifyToken, authController.login);

module.exports = Router;
