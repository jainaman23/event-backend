const logger = require("../utils/logger/logger");

module.exports = (err) => {
  const errors = [];
  if (Array.isArray(err.errors)) {
    const seqError = err.errors.map((ValidationErrorItem) => {
      return ValidationErrorItem.message;
    });
    errors.push(seqError);
  } else {
    errors.push(err);
  }
  logger.error(errors);
  return errors;
};
