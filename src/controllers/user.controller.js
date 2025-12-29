const User = require("../models/user.model");


// GET LOGGED-IN USER PROFILE
const getMyProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE PROFILE
const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE MY ACCOUNT
const deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ADMIN: GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
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


// ADMIN: GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    res.json({
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


// // ADMIN: UPDATE USER ROLE
// const updateUserRole = async (req, res) => {
//   try {
//     const { role, id } = req.body;

//     const user = await User.findByIdAndUpdate(
//       id,
//       { role },
//       { new: true }
//     ).select("-password");

//     res.json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// ADMIN: DELETE USER
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
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
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  // updateUserRole,
  deleteUser,
};