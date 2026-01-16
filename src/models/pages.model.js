const mongoose = require("mongoose");

const pagesSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    content: {
        type: String,
        required: true,
    },

    images: [String],

    isActive: {
        type: Boolean,
        default: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    }

}, {
    timestamps: true
});

const Pages = mongoose.model("pages", pagesSchema);

module.exports = Pages;
