const express = require("express");
const router = express.Router();
const { verifyQrCode } = require("@controllers/coordinator");

router.route("/verifyQrCode").patch(verifyQrCode);

module.exports = router;
