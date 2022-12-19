const config = {
  BASE_URL: "http://localhost:3000",
  DATABASE: {
    url: "mongodb+srv://events:dpJdUIZhKHa3LjCC@cluster0.fhdbl0u.mongodb.net/?retryWrites=true&w=majority",
  },
  JWT: {
    secret: "1234576890",
    expiry: "86400s",
    algorithms: ["HS256"],
  },
  DEFAULT_RANDOM_ID_GENERATOR_LENGTH: 12,
  PAYMENT_GATEWAY: {
    KEY_ID: "rzp_test_AkwPqPwauYzwS8",
    KEY_SECRET: "nGgN0BN2wiwbGH4SFOpcQ9pz",
  },
  EMAIL_SERVER: {
    host: "mail.lataservices.com",
    port: 465,
    username: "info@lataservices.com",
    password: "admin@$123#",
  },
};

module.exports = config;
