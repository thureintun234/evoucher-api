const mongoose = require("mongoose");

const promotionSchema = mongoose.Schema(
  {
    promo_code: {
      type: String,
      required: true,
      validate(value) {
        if (value.split("").length < 11) {
          throw new Error("promod code must be 11 AlphaNumberic characters");
        }
      },
    },
    qr_code: {
      type: String,
      required: true,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
