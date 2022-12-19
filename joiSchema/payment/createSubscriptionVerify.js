const Joi = require("joi");

module.exports = {
  validationType: "body",
  schema: Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string(),
    signature: Joi.string(),
  }),
};
