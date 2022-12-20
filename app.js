require("dotenv").config();
require("module-alias/register");
const createError = require("http-errors");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { expressjwt } = require("express-jwt");
const { JWT } = require("@config");
const path = require("path");
const cors = require("cors");
const { extractToken } = require("@services");
const openRoutes = require("@routes/openRoutes");
const routes = require("@routes");

const app = express();

app.use(helmet());
app.use(helmet.hidePoweredBy());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const corsOptions = {
  origin: "*",
  allowedHeaders: ["x-request-id", "content-type", "authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  expressjwt({
    secret: JWT.secret,
    algorithms: JWT.algorithms,
    getToken: (req, res) => {
      return extractToken(req, res);
    },
    credentialsRequired: true,
  }).unless({
    path: openRoutes,
  }),
  (req, res, next) => {
    if (req.auth) {
      const { coordinatorId } = req.auth;
      if (!coordinatorId) {
        throw { status: 401, message: "Invalid authorization token" };
      }
    }
    next();
  },
  function (err, req, res, next) {
    next(err);
  }
);

app.use("/api/v1", routes);

app.use(function (error, _, res, _) {
  const errorResponse = {
    status: "failed",
    error: {
      message: error.message || "Something went wrong",
    },
  };
  if (error.data) {
    errorResponse.error.data = error.data;
  }
  res.status(error.status || 500).send(Object.freeze(errorResponse));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
