const router = require("express").Router();
const Voucher = require("../models/voucher.model");
const Promotion = require("../models/promotion.model");
var qr = require("qr-image");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const sharp = require("sharp");

// func for genrating qrcode image in upload folder
const generateQrCode = (voucher, user) => {
  var qr_png = qr.image(voucher, { type: "png" });
  qr_png.pipe(
    require("fs").createWriteStream(`${__dirname}/../upload/${user.phone}.png`)
  );
  return `${user.phone}.png`;
};

// generate 11alphanumeric promo_code
const generatePromoCode = (user) => {
  function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const promoCode =
    makeid(5) +
    `${user.phone.toString().split("").reverse().join("").slice(0, 6)}`;
  return promoCode;
};

router.post("/", auth, upload.single("image"), async (req, res) => {
  //image buffer
  const buffer = await sharp(req.file?.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.body.image = buffer;

  // set amount depend on quantity
  const amount = 10 * Number(req.body.quantity);
  req.body.amount = amount;

  // reduce amount to 10% when method is visa
  if (req.body.payment_method === "Visa") {
    req.body.amount = req.body.amount - req.body.amount / 10;
  }

  if (req.body.buy_type === "only me usage") {
    req.body.user_info = { name: req.user.name, phone: req.user.phone };
  } else if (req.body.buy_type === "gift to others") {
    req.body.user_info = {
      name: req.body.user_info.name,
      phone: req.user_info.phone,
      gift_per_limit: 5,
    };
  }

  const voucher = new Voucher(req.body);
  const qrCode = await generateQrCode(
    JSON.stringify({
      description: voucher.description,
      quantity: voucher.quantity,
      amount: voucher.amount,
    }),
    req.user
  );

  const finalPromoCode = await generatePromoCode(req.user);

  // promo code
  const promoCode = new Promotion({
    qr_code: qrCode,
    promo_code: finalPromoCode,
  });

  // adding promo id to voucher
  voucher.promo_code = voucher.promo_code.concat(promoCode._id);

  try {
    await promoCode.save();
    await voucher.save();
    res.status(201).send(voucher);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/", async (req, res) => {
  try {
    const vouchers = await Voucher.find({}).populate("promo_code", {
      promo_code: 1,
      qr_code: 1,
    });
    res.json(vouchers);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
