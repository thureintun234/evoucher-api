const router = require("express").Router();
const Item = require("../models/item.model");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const sharp = require("sharp");

router.post("/", auth, upload.single("image"), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.body.image = buffer;
  const item = new Item(req.body);

  try {
    await item.save();
    res.status(201).send(item);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
