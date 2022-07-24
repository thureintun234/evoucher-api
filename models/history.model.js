const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
  order,
});

const History = mongoose.model("History", historySchema);
module.exports = History;
