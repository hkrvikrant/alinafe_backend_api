const express = require("express");

const {
    getAllStaff,
    updateStaffStatus,
} = require("../controllers/admin.controller");
const {
    staffProtect,
    isAdmin,
} = require("../middlewares/auth.middleware");


const adminRoutes = express.Router();


adminRoutes.get("/getAllStaff", staffProtect, isAdmin, getAllStaff);
adminRoutes.post("/staffStatus", staffProtect, isAdmin, updateStaffStatus);



module.exports = adminRoutes;