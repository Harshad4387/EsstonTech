const mongoose = require("mongoose");

const productionRequestSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    // required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    default: null
  },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "materials_collected",
      "in_progress",
      "completed",
      "received"
    ],
    default: "pending"
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ProductionRequest = mongoose.model("ProductionRequest", productionRequestSchema);
module.exports = ProductionRequest;
