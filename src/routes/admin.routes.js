const express = require("express");

const upload = require("../middlewares/upload");
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
    updateCategory,
    getCategoryById,
    deleteCategory,
    getAllMainCategories,
    getCategoriesByParentID,
    formatedCategories,
} = require("../controllers/category.controller");
const { updateProductStatus } = require("../controllers/products.controller");


const adminRoutes = express.Router();


adminRoutes.get("/getAllStaff", staffProtect, isAdmin, getAllStaff);
adminRoutes.post("/updateStaffStatus", staffProtect, isAdmin, updateStaffStatus);

adminRoutes.get("/getAllUser", staffProtect, isAdmin, getAllUsers);
adminRoutes.post("/getUserById", staffProtect, isAdmin, getUserById);
adminRoutes.post("/updateUserDetailsById", staffProtect, isAdmin, updateUserDetailsById);
adminRoutes.delete("/deleteUser", staffProtect, isAdmin, deleteUser);

adminRoutes.post("/createCategory", staffProtect, isAdmin,
    upload.single("image"),
    createCategory);
adminRoutes.post("/updateCategory", staffProtect, isAdmin,
    upload.single("image"),
    updateCategory);
adminRoutes.get("/getAllCategories", staffProtect, isAdmin, getAllCategories);
adminRoutes.post("/getCategoryById", staffProtect, isAdmin, getCategoryById);
adminRoutes.post("/deleteCategory", staffProtect, isAdmin, deleteCategory);

adminRoutes.get("/getAllMainCategories", staffProtect, isAdmin, getAllMainCategories);
adminRoutes.post("/getCategoriesByParentID", staffProtect, isAdmin, getCategoriesByParentID);
adminRoutes.get("/formatedCategories", staffProtect, isAdmin, formatedCategories);

adminRoutes.post("/updateProductStatus", staffProtect, isAdmin, updateProductStatus);



module.exports = adminRoutes;