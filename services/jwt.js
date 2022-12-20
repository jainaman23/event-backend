const JWT = require("jsonwebtoken");
const { JWT: JWT_CONFIG } = require("../config/dev");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  generateToken: (obj) => {
    return JWT.sign(obj, JWT_CONFIG.secret, {
      algorithm: JWT_CONFIG.algorithms[0],
      expiresIn: JWT_CONFIG.expiry,
      jwtid: uuidv4(),
    });
  },

  extractToken: (req) => {
    let token = req.headers.authorization;
    if (token && token.split(" ")[0] === "Bearer") {
      return token.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
};
