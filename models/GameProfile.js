const mongoose = require("mongoose");

const GameProfileSchema = new mongoose.Schema({
  name: String,
  balance: {
    type: Number,
    default: 0,
  },
  UPI: String,
  totalwin: {
    type: Number,
    default: 0,
  },
  userId: String,
  sponsorId: String,
  levelIncome: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("GameProfile", GameProfileSchema);
