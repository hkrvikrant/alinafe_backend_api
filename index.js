const express = require("express");
const handleConnection = require("./connection");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
const PORT = 8000;

// DB Connection
handleConnection("mongodb://127.0.0.1:27017/alinafe_backend");

app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log("Server Started...");
});