const router = require("express").Router();
const Order = require("../models/order.model");
const Item = require("../models/item.model");
const auth = require("../middleware/auth");
const History = require("../models/history.model");

router.post("/order", auth, async (req, res) => {
  const item = await Item.findById(req.body.item_id);
  const order = new Order({
    evoucher_code: req.body.evoucher_code ? req.body.evoucher_code : null,
    user_id: req.user._id,
    item_id: item._id,
    amount: item.price,
    quantity: req.body.quantity,
    total: item.price * req.body.quantity,
    payment_method: req.body.payment_method,
  });

  // if user used evoucher total will reduce 20%
  if (order.evoucher_code !== null) {
    const discount_percentage = 20;
    order.total = order.total - order.total * (discount_percentage / 100);
  }

  // saved order history
  const history = new History({
    order_id: order._id,
    user_id: req.user._id,
  });

  try {
    await order.save();
    await history.save();

    res.status(201).json(order);
  } catch (e) {
    res.status(401).json(e);
  }
});

router.get("/histories", auth, async (req, res) => {
  try {
    const histories = await History.find({})
      .populate("order_id")
      .populate("user_id");
    res.json(histories);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
