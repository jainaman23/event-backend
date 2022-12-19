const dateTime = require("./dateTime");
const paymentgateway = require("./paymentgateway");
const mailer = require("./email");

module.exports = {
  ...dateTime,
  paymentgateway,
  mailer,
};
