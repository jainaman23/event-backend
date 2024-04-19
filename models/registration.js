const mongoose = require("mongoose");
4;
const { Schema } = mongoose;
const { REGISTRATION_TYPE } = require("@constant");

const Registration = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    isMember: { type: Boolean, required: true },
    batch: { type: Number, required: true },
    isAttended: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["PAID", "FAILED", "NOT_PAID"],
      default: "NOT_PAID",
    },
    registrationType: {
      type: String,
      enum: [...Object.values(REGISTRATION_TYPE)],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", Registration);
