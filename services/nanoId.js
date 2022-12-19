const { nanoid } = require("nanoid");
const { DEFAULT_RANDOM_ID_GENERATOR_LENGTH } = require("../config");

module.exports = {
  generateRandomId: (characters = DEFAULT_RANDOM_ID_GENERATOR_LENGTH) => {
    return nanoid(characters);
  },
};
