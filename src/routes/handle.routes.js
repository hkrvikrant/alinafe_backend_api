const express = require("express");
const userRoutes = require("./user.routes");

const handleRoutes = express.Router();

handleRoutes.use("/api/user", userRoutes);

module.exports = handleRoutes;