const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  // updateUserRole,
  deleteUser,
} = require("../controllers/user.controller");

const {
  protect,
  isAdmin
} = require("../middlewares/auth.middleware.js")


const userRoutes = express.Router();


userRoutes.get("/", protect, getMyProfile);
userRoutes.put("/", protect, updateMyProfile);
userRoutes.delete("/", protect, deleteMyAccount);


// Admin
// userRoutes.get("/", protect, getAllUsers);
// userRoutes.get("/:id", protect, getUserById);
// // userRoutes.put("/role", protect, isAdmin, updateUserRole);
// userRoutes.delete("/:id", protect, deleteUser);




module.exports = userRoutes;