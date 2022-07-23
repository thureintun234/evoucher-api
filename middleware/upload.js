const multer = require("multer");

// const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

module.exports = upload;
