const User = require("../models/userModal");

const handleGetAllUsers = async (req, res) => {
  const allUsers = await User.find({});
  return res.status(200).send({
    status: true,
    data: allUsers,
  });
};

const handleGetUserById = async (req, res) => {
  const body = req?.params;

  if (
    !body || !body.id
  ) {
    return res.status(400).send({ msg: "All fields are required..." });
  }

  const { id } = req.params;
  const userDetails = await User.findById(id);
  return res.status(200).send({
    msg: userDetails == null ? "User Not Found" : "User Details",
    data: userDetails == null ? {} : userDetails,
  });
};

const handleCreateNewUser = async (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.firstName ||
    // !body.lastName ||
    !body.email ||
    !body.gender
  ) {
    return res.status(400).send({ msg: "All fields are required..." });
  }

  const existingUser = await User.findOne({ email: body.email });

  if (existingUser) {
    return res.status(400).json({
      status: false,
      message: "Email already registered",
    });
  }

  const createdUser = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    gender: body.gender,
  });

  return res.status(201).send({ msg: "Success", data: createdUser });
};

const handleUpdateUser = async (req, res) => {
  const body = req.body;

  const existingUser = await User.findOne({ _id: body.id });

  if (!existingUser) {
    return res.status(400).json({
      status: false,
      message: "This user doesn't exist",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(body?.id, {
    firstName: body?.firstName,
    lastName: body?.lastName,
    gender: body?.gender,
  });

  return res.send({
    status: updatedUser == null ? false : true,
    msg: updatedUser == null ? "Incorrect User Id" : "Details Update Successfully",
  });
};

const handleDeleteUser = async (req, res) => {
  const { id } = req.body;
  const deletedUser = await User.findByIdAndDelete(id);
  return res.status(200).send({
    msg: deletedUser == null ? "Invalid Id" : "User Deleted",
    data: deletedUser,
  });
};

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateNewUser,
  handleUpdateUser,
  handleDeleteUser,
};