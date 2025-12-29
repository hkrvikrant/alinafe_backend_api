const Staff = require("../models/staff.model");


// GET ALL Staff
const getAllStaff = async (req, res) => {
    try {
        const users = await Staff.find().select("-password");
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

// UPDATE Staff ROLE
const updateStaffStatus = async (req, res) => {
    try {
        const { status, id } = req.body;

        const user = await Staff.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = {
    getAllStaff,
    updateStaffStatus,
};