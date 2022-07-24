const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  item,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
