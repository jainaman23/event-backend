const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).with("email", "password"),
};
