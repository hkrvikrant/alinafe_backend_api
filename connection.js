const mongoose = require("mongoose");

const handleConnection = async (url) => {
  return await mongoose
    .connect(url)
    .then(() => console.log("DB Connected..."))
    .catch(() => console.log("DB Connection Error..."));
};

module.exports = handleConnection;