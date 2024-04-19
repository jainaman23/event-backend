const config = {
  BASE_URL: "http://localhost:3000",
  DATABASE: {
    url: "mongodb+srv://mhsosa:5iqdo9l7spv6Dqxg@cluster0.ieqsqtm.mongodb.net/events?retryWrites=true&w=majority",
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
    name: "linode",
    host: "mail.lataservices.com",
    secure: true,
    port: 465,
    username: "do-not-reply@mhsosa.in",
    password: "0IIy!yK2@u{#",
  },
};

module.exports = config;
