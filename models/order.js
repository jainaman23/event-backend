const mongoose = require("mongoose");
const { Schema } = mongoose;

const Order = new Schema(
  {
    registrationId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Registration",
    },
    amount: { type: Number },
    currency: { type: String },
    orderId: { type: String },
    entity: { type: String },
    receipt: { type: String },
    status: {
      type: String,
      enum: ["CREATED", "VERIFIED", "PAID"],
      default: "CREATED",
    },
    attempts: { type: Number },
    notes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Order);
