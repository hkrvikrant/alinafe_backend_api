const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        default: null
    },

    image: {
        type: String
    },

    commissionPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    }

}, {
    timestamps: true
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
