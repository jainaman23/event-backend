const mongoose = require("mongoose");
const { Schema } = mongoose;

const Member = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: String,
    mobileNumber: String,
    batch: { type: Number, required: true },
    isNewMember: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", Member);
