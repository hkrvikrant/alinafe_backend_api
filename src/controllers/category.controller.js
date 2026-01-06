const Category = require("../models/category.model");

const createCategory = async (req, res) => {
    try {
        const { name, slug, parentId, image } = req.body;

        const category = await Category.create({
            name,
            slug,
            parentId: parentId || null,
            image,
            createdBy: req.user._id // admin id
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL CATEGORY
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate("parentId", "name");

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.body.id,
            req.body,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
};