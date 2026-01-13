const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const adminRoutes = require("./admin.routes");
const vendorRoutes = require("./vendor.routes");

const handleRoutes = express.Router();


handleRoutes.use("/uploads", express.static("uploads"));

handleRoutes.use("/api/auth", authRoutes);
handleRoutes.use("/api/user", userRoutes);
handleRoutes.use("/api/admin", adminRoutes);
handleRoutes.use("/api/vendor", vendorRoutes);


module.exports = handleRoutes;
