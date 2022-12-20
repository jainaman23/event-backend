const express = require("express");
const router = express.Router();
const { getUserList, getUserById } = require("@controllers/user");

router.route("/").get(getUserList);
router.route("/:registrationId").get(getUserById);

module.exports = router;
