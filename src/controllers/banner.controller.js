const fs = require("fs");
const path = require("path");

const Banner = require("../models/banner.model");

// CREATE BANNER (ADMIN)
const createBanner = async (req, res) => {
    try {
        const {
            title,
            link,
            sortOrder,
            // startDate,
            // endDate,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Banner image is required"
            });
        }

        const image = req.file
            ? `/uploads/images/${req.file.filename}`
            : null;

        const banner = await Banner.create({
            title,
            link,
            sortOrder,
            // startDate,
            // endDate,
            image,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ACTIVE BANNERS (PUBLIC)
const getActiveBanners = async (req, res) => {
    try {
        // const now = new Date();

        const banners = await Banner.find({
            isActive: true,
            // $or: [
            //     { startDate: { $lte: now }, endDate: { $gte: now } },
            //     { startDate: null, endDate: null }
            // ]
        })
            .sort({ sortOrder: 1 });

        res.status(200).json({
            success: true,
            data: banners
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET All BANNERS (ADMIN)
const getAllBanners = async (req, res) => {
    try {
        // const now = new Date();

        const banners = await Banner.find({
            // isActive: true,
            // $or: [
            //     { startDate: { $lte: now }, endDate: { $gte: now } },
            //     { startDate: null, endDate: null }
            // ]
        })
            .sort({ sortOrder: 1 });

        res.status(200).json({
            success: true,
            data: banners
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE BANNER (ADMIN)
const updateBanner = async (req, res) => {
    try {
        const { id } = req.body;

        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        if (req.file) {
            if (banner.image) {

                const oldImagePath = path.join(
                    __dirname,
                    "../..",
                    banner.image
                );

                // Delete file only if exists
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            banner.image = `/uploads/images/${req.file.filename}`;
        }

        Object.assign(banner, req.body);
        await banner.save();

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE BANNER STATUS
const updateBannerStatus = async (req, res) => {
    try {
        const { id, isActive } = req.body
        const banner = await Banner.findByIdAndUpdate(
            id,
            { isActive: isActive },
            { new: true }
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Banner status update successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBanner,
    getActiveBanners,
    getAllBanners,
    updateBanner,
    updateBannerStatus,
};