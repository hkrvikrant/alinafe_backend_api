const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true
    },

    image: {
        type: String,
        required: true
    },

    link: {
        type: String,
        default: null
    },

    sortOrder: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },

    startDate: Date,
    endDate: Date,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true
    }

}, { timestamps: true });

const Banners = mongoose.model("banners", bannerSchema);

module.exports = Banners;
