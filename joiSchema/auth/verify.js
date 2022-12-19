const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
  }),
};
