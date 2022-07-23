const router = require("express").Router();

router.get("/", async (req, res) => {
  res.json({ users: ["mgmg", "david", "demon"] });
});

module.exports = router;
