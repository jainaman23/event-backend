const mongoose = require("mongoose");
const { Schema } = mongoose;

const Coordinator = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coordinator", Coordinator);
