var mongoose = require("mongoose");

const isValidObjectId = (id, label = "Id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { status: 400, message: `Invalid ${label}` };
  }
  return mongoose.Types.ObjectId(id);
};

const generateRandomCharacters = (length = 10) => {
  return Array(length)
    .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
};

const removeUndefined = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const capitalizeString = (sentence) => {
  const chunks = sentence.split(" ");
  chunks.forEach((chunk, index) => {
    chunks[index] = chunk.charAt(0).toUpperCase() + chunk.slice(1);
  });
  const formatedString = chunks.join(" ");
  return formatedString;
};

const toCamelCase = (sentence, char = " ") => {
  const chunks = sentence.split(char);
  chunks.forEach((chunk, index) => {
    if (index === 0) {
      chunks[index] = chunk.toLowerCase();
    } else {
      chunks[index] =
        chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase();
    }
  });
  const formatedString = chunks.join("");
  return formatedString;
};

module.exports = {
  isValidObjectId,
  generateRandomCharacters,
  removeUndefined,
  capitalizeString,
  toCamelCase,
};
