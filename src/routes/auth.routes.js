const express = require("express");
const {
    loginUser,
    registerUser,
    registerStaff,
    loginStaff
} = require("../controllers/auth.controller");

const authRoutes = express.Router();


authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);

authRoutes.post("/staff/register", registerStaff);
authRoutes.post("/staff/login", loginStaff);



module.exports = authRoutes;