const Category = require("../models/category.model");

// CREATE CATEGORY
const createCategory = async (req, res) => {

    try {
        const { name, slug, parentId } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }
        const image = req.file
            ? `/uploads/categories/${req.file.filename}`
            : null;

        const category = await Category.create({
            name,
            slug,
            parentId: parentId || null,
            image,
            createdBy: req.user?._id
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

// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.body.id)
            .populate("parentId", "name");

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE CATEGORY (SOFT DELETE)
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.body.id,
            { isActive: false },
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
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    getCategoryById,
    deleteCategory,
};