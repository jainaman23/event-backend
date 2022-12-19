const express = require("express");
const router = express.Router();
const auth = require("@routes/auth");
const payment = require("@routes/payment");
const plan = require("@routes/plan");

router.use("/auth", auth);
router.use("/payment", payment);
router.use("/plan", plan);

module.exports = router;
