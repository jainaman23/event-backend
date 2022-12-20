const {
  loginSchema,
  registerSchema,
  verifySchema,
  sendEmailSchema,
} = require("@joiSchema/auth");
const { createSubscriptionOrderSchema } = require("@joiSchema/payment");

module.exports = (replace) => {
  return {
    "POST:/api/v1/auth/login": loginSchema,
    "POST:/api/v1/auth/verify": verifySchema,
    "POST:/api/v1/auth/register": registerSchema,
    "POST:/api/v1/auth/send-email": sendEmailSchema,

    "POST:/api/v1/subscription/purchase": createSubscriptionOrderSchema,
  };
};
