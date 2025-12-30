const Staff = require("../models/staff.model");
const User = require("../models/user.model");


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




// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
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

// UDPATE USER
const updateUserDetailsById = async (req, res) => {
    try {
        const {
            id,
            fullName,
            phone,
        } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { fullName, phone },
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

// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.body;

        const user = await User.findById(id).select("-password");
        if (!user)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "User deleted"
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

    getAllUsers,
    updateUserDetailsById,
    getUserById,
    deleteUser,

};