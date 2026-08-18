const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {

    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    alternatePhoneNumber: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
    },

    // Admin Details
    adminName: {
      type: String,
      required: true,
    },

    adminEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    adminPassword: {
      type: String,
      required: true,
    },

    // Business Details
    gstNumber: {
      type: String,
    },

    panNumber: {
      type: String,
    },

    industryType: {
      type: String,
    },

    website: {
      type: String,
    },

    companyLogo: {
      type: String,
    },

    // Subscription
    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },

    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },

    subscriptionEndDate: {
      type: Date,
    },

    // Status
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional Settings
    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);