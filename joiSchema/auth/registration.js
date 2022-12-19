const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    joinMembership: Joi.boolean().required(),
    batch: Joi.number().required(),
  }),
};
