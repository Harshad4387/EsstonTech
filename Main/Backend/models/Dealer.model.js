
const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String }
  },

  information: {
    email: { type: String },
    shopName: { type: String },
    gstNumber: { type: String }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Dealer = mongoose.model("Dealer", dealerSchema);

module.exports = Dealer;