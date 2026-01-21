const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
        required: true
    },

    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true
        }
    ],

    name: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        required: true
    },

    short_description: {
        type: String,
    },

    price: {
        type: Number,
        required: true
    },

    discountedPrice: {
        type: Number
    },

    stock: {
        type: Number,
        required: true
    },

    sku: {
        type: String,
        unique: true,
        required: true
    },

    brand: {
        type: String,
    },

    model: {
        type: String,
    },

    connectivity: {
        type: String,
    },

    warranty: {
        type: String,
    },

    inTheBox: {
        type: String,
    },

    images: [String],

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Product = mongoose.model("product", productSchema);

module.exports = Product;