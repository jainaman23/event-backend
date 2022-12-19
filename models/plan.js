const mongoose = require("mongoose");
const { Schema } = mongoose;

const Plan = new Schema(
  {
    type: { type: String, required: true },
    amount: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plan", Plan);
