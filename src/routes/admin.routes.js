const express = require("express");

const {
    getAllStaff,
    updateStaffStatus,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUserDetailsById,
} = require("../controllers/admin.controller");
const {
    staffProtect,
    isAdmin,
} = require("../middlewares/auth.middleware");
const {
    createCategory,
    getAllCategories,
} = require("../controllers/category.controller");


const adminRoutes = express.Router();


adminRoutes.get("/getAllStaff", staffProtect, isAdmin, getAllStaff);
adminRoutes.post("/updateStaffStatus", staffProtect, isAdmin, updateStaffStatus);

adminRoutes.get("/getAllUser", staffProtect, isAdmin, getAllUsers);
adminRoutes.post("/getUserById", staffProtect, isAdmin, getUserById);
adminRoutes.post("/updateUserDetailsById", staffProtect, isAdmin, updateUserDetailsById);
adminRoutes.delete("/deleteUser", staffProtect, isAdmin, deleteUser);

adminRoutes.post("/createCategory", staffProtect, isAdmin, createCategory);
adminRoutes.get("/getAllCategories", staffProtect, isAdmin, getAllCategories);



module.exports = adminRoutes;