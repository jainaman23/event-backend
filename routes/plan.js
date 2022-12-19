const express = require("express");
const router = express.Router();
const { getPlans } = require("@controllers/plan");

router.route("/").get(getPlans);

module.exports = router;
