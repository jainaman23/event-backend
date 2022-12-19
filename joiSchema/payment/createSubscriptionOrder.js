const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    planId: Joi.string().required(),
  }),
};
