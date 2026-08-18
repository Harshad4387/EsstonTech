const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealer",
    required: true
  },

 products: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    productionRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionRequest",
      default: null
    },

    quantity: {
      type: Number,
      required: true
    },

    readyQuantity: {
      type: Number,
      default: 0
    },
    manufacturingQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    totalAmount: {
      type: Number,
      required: true
    }
  }
],

  rawMaterials: [
    {
      rawMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawMaterial"
      },

      quantity: {
        type: Number,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      discount: {
        type: Number,
        default: 0
      },

      totalAmount: {
        type: Number,
        required: true
      }
    }
  ],

  grandTotal: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "unapproved",
      "manufacturing",
      "completed",
      "delivered"
    ],
    default: "pending"
  },

  Discount: {
    type: String,
    default: "0"
  },

  remarks: {
    type: String
  },

  orderDate: {
    type: Date,
    default: Date.now
  },

  compleletion_date: {
    type: Date,
    default: Date.now
  }

});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;