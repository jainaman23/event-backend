const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    registrationId: Joi.string().required(),
  }),
};
