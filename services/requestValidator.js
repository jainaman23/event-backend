const validationSchemas = require("../joiSchema");

module.exports = async (req, res, next) => {
  try {
    const validators = validationSchemas(req.path)[
      `${req.method}:${req.originalUrl.split("?").shift()}`
    ];
    if (Array.isArray(validators)) {
      validators.forEach(validate);
    } else {
      validate(validators);
    }
    next();
  } catch (err) {
    next(err);
  }

  function validate(validator) {
    const schemaToValidateAgainst = validator?.schema;
    const validationType = validator?.validationType || "body";

    if (!schemaToValidateAgainst) {
      throw { status: 400, message: "validation failed" };
    }

    const { value, error } = schemaToValidateAgainst.validate(
      req[validationType]
    );

    if (error) {
      throw {
        status: 400,
        message: `Validation failed: ${error.details[0].message}`,
      };
    } else {
      req[validationType] = value;
    }
  }
};
