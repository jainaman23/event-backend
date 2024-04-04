const config = {
  BASE_URL: "http://localhost:3000",
  DATABASE: {
    url: "mongodb+srv://mhsosa:5iqdo9l7spv6Dqxg@cluster0.ieqsqtm.mongodb.net/mhsosa_2024?retryWrites=true&w=majority",
  },
  JWT: {
    secret: "1234576890",
    expiry: "86400s",
    algorithms: ["HS256"],
  },
  DEFAULT_RANDOM_ID_GENERATOR_LENGTH: 12,
  PAYMENT_GATEWAY: {
    KEY_ID: "rzp_live_H9heM7jcswk7M2",
    KEY_SECRET: "vym5ZQaew5KFUdJ4Iu0io6Ve",
  },
  EMAIL_SERVER: {
    name: "linode",
    host: "mail.lataservices.com",
    secure: true,
    port: 465,
    username: "do-not-reply@mhsosa.in",
    password: "0IIy!yK2@u{#",
  },
};

module.exports = config;
