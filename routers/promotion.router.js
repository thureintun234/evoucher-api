const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json({ promotions: ["mgmg", "david", "demon"] });
});

module.exports = router;
