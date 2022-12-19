const mongoose = require("mongoose");
const { Schema } = mongoose;

const Registration = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    isMember: { type: Boolean, required: true },
    batch: { type: Number, required: true },
    isAttended: { type: Boolean, required: false },
    paymentStatus: {
      type: String,
      enum: ["PAID", "FAILED", "NOT_PAID"],
      default: "NOT_PAID",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", Registration);
