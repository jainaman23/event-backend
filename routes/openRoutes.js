module.exports = [
  { url: "/api/v1/auth/verify", methods: ["POST"] },
  { url: "/api/v1/auth/register", methods: ["POST"] },
  { url: "/api/v1/auth/login", methods: ["POST"] },
  { url: "/api/v1/plan", methods: ["GET"] },
  { url: "/api/v1/auth/send-email", methods: ["POST"] },
  { url: "/api/v1/payment/callback" },
];
