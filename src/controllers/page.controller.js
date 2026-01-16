const Pages = require("../models/pages.model");

// CREATE PAGE (ADMIN)
const createPage = async (req, res) => {
    try {
        const { title, slug, content } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const images = req.files
            ? req.files.map(file => `/uploads/images/${file.filename}`)
            : [];

        const page = await Pages.create({
            title,
            slug,
            content,
            images,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Page created successfully",
            data: page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PAGE (ADMIN)
const updatePage = async (req, res) => {
    try {

        const {
            id,
            title,
            slug,
            content,
        } = req.body;

        const page = await Pages.findOne({
            _id: id,
        });
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        if (title) {
            page.title = title;
        }
        if (slug) {
            page.slug = slug;
        }

        if (content) {
            page.content = content;
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(
                file => `/uploads/images/${file.filename}`
            );
            page.images = [...page.images, ...newImages];
        }

        await page.save();

        res.status(200).json({
            success: true,
            message: "Page updated successfully.",
            data: page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PAGE (SOFT DELETE)
const deletePage = async (req, res) => {
    try {
        const { id } = req.body;

        const page = await Pages.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Page deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL PAGES (ADMIN)
const getAllActivePages = async (req, res) => {
    try {
        const pages = await Pages.find({
            isActive: true
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: pages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PAGE BY SLUG (PUBLIC)
const getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.body;

        const page = await Pages.findOne({
            slug,
            isActive: true
        })

        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        res.status(200).json({
            success: true,
            data: page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPage,
    updatePage,
    deletePage,
    getAllActivePages,
    getPageBySlug,
};