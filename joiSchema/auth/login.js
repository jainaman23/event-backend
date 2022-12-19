const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    _id: Joi.string().required(),
  }).with("countryCode", "mobileNumber"),
};
