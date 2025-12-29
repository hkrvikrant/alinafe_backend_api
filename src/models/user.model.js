const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "suspended", "blocked"],
    default: "active"
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  warningCount: {
    type: Number,
    default: 0
  },

  suspension: {
    reason: String,
    suspendedAt: Date,
    suspendedTill: Date
  },

  block: {
    reason: String,
    blockedAt: Date
  },

  addresses: [addressSchema],

  lastLoginAt: Date

}, {
  timestamps: true
});

const User = mongoose.model("user", userSchema);

module.exports = User;