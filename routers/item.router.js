const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json({ items: ["mgmg", "david", "demon"] });
});

module.exports = router;
