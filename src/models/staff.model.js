const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
}, { _id: false });

const staffSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "vendor"],
        default: "vendor",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "blocked"],
        default: "pending"
    },

    // Vendor specific
    shopName: {
        type: String,
        required: function () {
            return this.role === "vendor";
        }
    },

    shopLogo: String,
    gstNumber: String,
    panNumber: String,

    bankDetails: {
        type: bankSchema,
        required: function () {
            return this.role === "vendor";
        }
    },

    commissionPercent: {
        type: Number,
        default: 3
    },

    lastLoginAt: Date
}, {
    timestamps: true
});


const Staff = mongoose.model("staff", staffSchema);

module.exports = Staff;