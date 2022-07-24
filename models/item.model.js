const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error("Price must be a positive number");
        }
      },
    },
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.image;
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
