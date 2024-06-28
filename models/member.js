const mongoose = require("mongoose");
const { Schema } = mongoose;

const Member = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    countryCode: String,
    mobileNumber: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", Member);
