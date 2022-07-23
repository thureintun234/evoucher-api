const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json({ orders: ["mgmg", "david", "demon"] });
});

module.exports = router;
