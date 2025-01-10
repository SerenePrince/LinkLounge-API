const User = require("../models/User");
const Lounge = require("../models/Lounge");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Get all users from MongoDB, excluding password field
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
      return res.status(404).json({
        message: "No users found. Please try again later.",
      });
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "An error occurred while fetching users. Please try again later.",
      error: err.message,
    });
  }
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;

  // Convert username and email to lowercase
  username = username.toLowerCase();
  email = email.toLowerCase();

  // Confirm data presence
  if (!username || !email || !password) {
    return res.status(400).json({
      message:
        "Username, email, and password are required to create an account.",
    });
  }

  // Check for duplicate email and username
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    return res.status(409).json({
      message: "This email is already in use. Please use a different email.",
    });
  }

  const duplicateUsername = await User.findOne({ username }).lean().exec();
  if (duplicateUsername) {
    return res.status(409).json({
      message: "This username is already taken. Please choose another one.",
    });
  }

  try {
    // Hash password before storing
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = { username, email, password: hashedPwd };

    // Create and store new user
    const user = await User.create(userObject);

    if (user) {
      return res.status(201).json({
        message: `New user account for ${username} has been successfully created.`,
      });
    } else {
      return res.status(400).json({
        message:
          "Invalid user data received. Please check your input and try again.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "An error occurred while creating the user. Please try again later.",
      error: error.message,
    });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  let { id, username, email, password } = req.body;

  // Convert username and email to lowercase
  username = username.toLowerCase();
  email = email.toLowerCase();

  // Confirm required data
  if (!id || !username || !email) {
    return res.status(400).json({
      message:
        "Username, email, and user ID are required to update your account.",
    });
  }

  try {
    // Find user to update
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please check the user ID and try again.",
      });
    }

    // Check for duplicate email and username, excluding current user
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail && duplicateEmail._id.toString() !== id) {
      return res.status(409).json({
        message: "This email is already in use by another account.",
      });
    }

    const duplicateUsername = await User.findOne({ username }).lean().exec();
    if (duplicateUsername && duplicateUsername._id.toString() !== id) {
      return res.status(409).json({
        message:
          "This username is already taken. Please select a different one.",
      });
    }

    // Update user fields
    user.username = username;
    user.email = email;

    if (password) {
      // Hash new password if provided
      user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save();

    res.json({
      message: `${updatedUser.username}'s account has been updated successfully.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "An error occurred while updating the user. Please try again later.",
      error: err.message,
    });
  }
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm user ID is provided
  if (!id) {
    return res.status(400).json({
      message: "Please provide the user ID to delete the account.",
    });
  }

  try {
    // Check if the user has any assigned lounges
    const lounge = await Lounge.findOne({ user: id }).lean().exec();
    if (lounge) {
      return res.status(400).json({
        message:
          "This user has lounges associated with their account. Please delete the lounges first.",
      });
    }

    // Find the user to delete
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please check the user ID and try again.",
      });
    }

    // Store username and ID for the response message
    const { username, _id: userId } = user;

    // Delete the user
    await user.deleteOne();

    res.json({
      message: `User ${username} with ID ${userId} has been deleted successfully.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "An error occurred while deleting the user. Please try again later.",
      error: err.message,
    });
  }
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
