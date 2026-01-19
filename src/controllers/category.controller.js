const Category = require("../models/category.model");

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const {
            name,
            slug,
            parentId,
            commissionPercentage,
        } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }

        if (commissionPercentage < 0 || commissionPercentage > 100) {
            return res.status(400).json({
                success: false,
                message: "Commission must be between 0 and 100"
            });
        }

        const image = req.file
            ? `/uploads/images/${req.file.filename}`
            : null;

        const category = await Category.create({
            name,
            slug,
            parentId: parentId || null,
            image,
            commissionPercentage,
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
            .populate("parentId", "name commissionPercentage");

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
        const {
            name,
            slug,
            parentId,
            commissionPercentage
        } = req.body;

        if (commissionPercentage !== undefined) {
            if (commissionPercentage < 0 || commissionPercentage > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Commission must be between 0 and 100"
                });
            }
        }

        const image = req.file
            ? `/uploads/images/${req.file.filename}`
            : null;

        const category = await Category.findByIdAndUpdate(
            req.body._id,
            {
                name,
                slug,
                parentId,
                commissionPercentage,
                image,
            },
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
            .populate("parentId", "name commissionPercentage");

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

// GET All Main CATEGORY For Vendor
const getAllMainCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            parentId: null,
            isActive: true
        })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: categories,
            count: categories.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET All CATEGORY of a Category For Vendor
const getCategoriesByParentID = async (req, res) => {
    try {
        const { id } = req.body;
        const categories = await Category.find({
            parentId: id,
            isActive: true
        })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: categories,
            count: categories.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Category list in format
const formatedCategories = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $match: {
                    parentId: null,
                    isActive: true
                }
            },
            {
                $lookup: {
                    from: "categories",
                    let: { parentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$parentId", "$$parentId"] },
                                isActive: true
                            }
                        },
                        {
                            $lookup: {
                                from: "categories",
                                let: { childId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$parentId", "$$childId"] },
                                            isActive: true
                                        }
                                    }
                                ],
                                as: "data"
                            }
                        }
                    ],
                    as: "data"
                }
            }
        ]);

        res.json({
            success: true,
            data: categories,
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
    getCategoryById,
    deleteCategory,

    getAllMainCategories,
    getCategoriesByParentID,
    formatedCategories,
};