const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    evoucher_code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
    payment_method: {
      type: String,
      default: "Cash",
    },
    card: {
      type: Object,
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    amount: {
      type: Number,

      validate(value) {
        if (value < 0) {
          throw new Error("amount must be a positive number");
        }
      },
    },
    quantity: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error("amount must be a positive number");
        }
      },
    },
    total: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error("amount must be a positive number");
        }
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
