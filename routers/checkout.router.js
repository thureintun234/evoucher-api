const router = require("express").Router();
const Order = require("../models/order.model");
const Item = require("../models/item.model");
const auth = require("../middleware/auth");
const History = require("../models/history.model");
const config = require("../utils/config");
const stripe = require("stripe")(config.STRIPE_SECRET_KEY);

// generate stripe token for charge
const createToken = async (cardData) => {
  let token = {};
  try {
    token = await stripe.tokens.create({
      card: {
        number: cardData.number,
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        cvc: cardData.cvc,
      },
    });
  } catch (error) {
    switch (error.type) {
      case "StripeCardError":
        token.error = error.message;
        break;
      default:
        token.error = error.message;
        break;
    }
  }
  return token;
};

// generate stripe charge
const createCharge = async (tokenId, amount) => {
  let charge = {};
  try {
    charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: tokenId,
      description: "My first payment",
    });
  } catch (error) {
    charge.error = error.message;
  }
  return charge;
};

router.post("/order", auth, async (req, res) => {
  const item = await Item.findById(req.body.item_id);

  try {
    // stripe integration for visa or master cards
    const token = await createToken(req.body.card);
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const totalAmount = item.price * req.body.quantity;
    const charge = await createCharge(token.id, totalAmount);

    // if card is valid and then proceed to other process
    if (charge && charge.status == "succeeded") {
      const order = new Order({
        evoucher_code: req.body.evoucher_code ? req.body.evoucher_code : null,
        user_id: req.user._id,
        item_id: item._id,
        amount: item.price,
        quantity: req.body.quantity,
        total: item.price * req.body.quantity,
        card: req.body.card,
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
      await order.save();
      await history.save();

      res.status(201).json(order);
    } else {
      return res.status(400).json({ error: "Your card is invalid" });
    }
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
