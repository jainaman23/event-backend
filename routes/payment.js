const express = require("express");
const router = express.Router();
const { paymentCallback } = require("@controllers/payment");

router.route("/callback").post(paymentCallback);

module.exports = router;
