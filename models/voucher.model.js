const mongoose = require("mongoose");

const voucherSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    expire_date: {
      type: Date,
      expires: 86400,
      default: Date.now,
    },
    image: {
      type: Buffer,
    },
    amount: {
      type: Number,

      validate(value) {
        if (value < 0) {
          throw new Error("amount must be a positive number");
        }
      },
    },
    payment_method: {
      type: String,
      default: "Cash",
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
    buy_type: {
      type: String,
      trim: true,
      enum: ["only me usage", "gift to others"],
      default: "only me usage",
    },
    user_info: {
      name: { type: String, required: true, trim: true },
      phone: {
        type: Number,
        required: true,
        validate(value) {
          if (value < 0) {
            throw new Error("phone must be a positive number");
          }
        },
        max_limit: { type: Number, default: 10 },
        gift_per_limit: { type: Number },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    promo_code: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
      },
    ],
  },
  { timestamps: true }
);

voucherSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.image;
  },
});

voucherSchema.index({ expire_date: 1 }, { expireAfterSeconds: 86400 });

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
