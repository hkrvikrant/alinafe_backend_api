const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/user.controller");

const {
  protect,
  isAdmin
} = require("../middlewares/auth.middleware.js")


const userRoutes = express.Router();


userRoutes.get("/me", protect, getMyProfile);
userRoutes.put("/me", protect, updateMyProfile);
userRoutes.delete("/me", protect, deleteMyAccount);


// Admin
userRoutes.get("/", protect, isAdmin, getAllUsers);
userRoutes.get("/:id", protect, isAdmin, getUserById);
userRoutes.put("/role", protect, isAdmin, updateUserRole);
userRoutes.delete("/:id", protect, isAdmin, deleteUser);




module.exports = userRoutes;