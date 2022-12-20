const express = require("express");
const router = express.Router();
const auth = require("@routes/auth");
const payment = require("@routes/payment");
const plan = require("@routes/plan");
const user = require("@routes/user");
const coordinator = require("@routes/coordinator");

router.use("/auth", auth);
router.use("/payment", payment);
router.use("/plan", plan);
router.use("/user", user);
router.use("/coordinator", coordinator);

module.exports = router;
