const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const handleRoutes = express.Router();


handleRoutes.use("/api", authRoutes);
handleRoutes.use("/api/user", userRoutes);


module.exports = handleRoutes;