const mongoose = require("mongoose");
const { Schema } = mongoose;

const Registration = new Schema(
  {
    registrationId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    isMember: { type: Boolean, required: true },
    batch: {
      to: { type: Number, required: true },
      from: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", Registration);
