const express = require("express");
const {
  handleCreateNewUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
} = require("../controllers/userController");

const userRoutes = express.Router();

userRoutes.get("/", handleGetAllUsers);
userRoutes.get("/:id", handleGetUserById);
userRoutes.post("/", handleCreateNewUser);
userRoutes.patch("/", handleUpdateUser);
userRoutes.delete("/", handleDeleteUser);

module.exports = userRoutes;