const Joi = require("joi");
const { REGISTRATION_TYPE } = require("@constant");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    joinMembership: Joi.boolean().required(),
    batch: Joi.number().required(),
    registrationType: Joi.string()
      .valid(...Object.values(REGISTRATION_TYPE))
      .required(),
  }),
};
