const config =
  process.env.mode == "dev" || process.env.mode == "stage"
    ? require("./dev")
    : require("./prod");

console.log("ENV", process.env.mode);

module.exports = config;
