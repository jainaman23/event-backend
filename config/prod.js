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
    KEY_ID: "rzp_test_6sZirSf4hXFich",
    KEY_SECRET: "XBvtjsLIyAQLLFtpXV4X9Q08",
  },
};

module.exports = config;
