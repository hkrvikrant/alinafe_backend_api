const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    default: "customer"
  },
  phone: String,
  avatar: String,

  addresses: [
    {
      fullName: String,
      addressLine: String,
      city: String,
      state: String,
      country: String,
      pinCode: String,
      phone: String
    }
  ]
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User;