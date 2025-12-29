const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const adminRoutes = require("./admin.routes");

const handleRoutes = express.Router();


handleRoutes.use("/api", authRoutes);
handleRoutes.use("/api/user", userRoutes);

handleRoutes.use("/api/admin", adminRoutes);


module.exports = handleRoutes;