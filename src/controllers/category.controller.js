const Category = require("../models/category.model");


// GET ALL CATEGORY
const getAllCategorys = async (req, res) => {
    try {
        const users = await Category.find().select("-password");
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllCategorys,
};