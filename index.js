const express = require("express");
const dotenv = require("dotenv")

const handleConnection = require("./connection");
const handleRoutes = require("./src/routes/handle.routes");

dotenv.config();

const app = express();
const PORT = 8000;

// DB Connection
handleConnection(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", handleRoutes);

app.listen(PORT, () => {
  console.log("Server Started...");
});