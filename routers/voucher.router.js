const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json({ vouchers: ["mgmg", "david", "demon"] });
});

module.exports = router;
