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
            error: error.message
        });
    }
};

// GET ALL CATEGORY
const getAllCategorys = async (req, res) => {
    try {
        const category = await Category.find().select("-password");
        res.status(200).json({
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

module.exports = {
    createCategory,
    getAllCategorys,
};