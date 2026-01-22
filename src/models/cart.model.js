const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null
        },
        guestId: {
            type: String,
            default: null,
            index: true
        },
        items: [cartItemSchema],
        totalQuantity: {
            type: Number,
            default: 0
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        isGuest: {
            type: Boolean,
            default: true
        },
        expiresAt: {
            type: Date,
            index: true
        }
    },
    { timestamps: true }
);

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;