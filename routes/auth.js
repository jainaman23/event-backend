const express = require("express");
const router = express.Router();
const { registration, login, verify } = require("@controllers/auth");
const { requestValidator } = require("@services");

router.route("/verify").post(requestValidator, verify);
router.route("/register").post(requestValidator, registration);
router.route("/login").post(requestValidator, login);

module.exports = router;
