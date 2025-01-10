const Lounge = require("../models/Lounge");
const asyncHandler = require("express-async-handler");
const { uploadImage, deleteImage } = require("../config/cloudinary");

// @desc Get all lounges
// @route GET /lounges
// @access Private
const getAllLounges = asyncHandler(async (req, res) => {
  // Get all lounges with populated user info
  const lounges = await Lounge.find().populate("user", "username").lean();

  if (!lounges?.length) {
    return res.status(404).json({
      message:
        "No lounges found. Please ensure there are lounges created in the system.",
    });
  }

  res.json(lounges);
});

const createNewLounge = asyncHandler(async (req, res) => {
  const { user, title, description, buttons, icons, theme, isPublic } =
    req.body;

  // Parse user, buttons, and icons (if present), otherwise default to empty objects/arrays
  const parsedUser = user ? JSON.parse(user) : null;
  const parsedButtons = buttons ? JSON.parse(buttons) : []; // Default to empty array if not provided
  const parsedIcons = icons ? JSON.parse(icons) : []; // Default to empty array if not provided

  // Ensure user and title are provided
  if (!parsedUser || !title) {
    return res.status(400).json({
      message:
        "User and title are required. Please ensure both fields are filled in.",
    });
  }

  const normalizedUrl =
    parsedUser.username.toLowerCase().replace(/\s+/g, "-") +
    "/" +
    title.toLowerCase().replace(/\s+/g, "-");

  // Check for duplicate URL
  const duplicate = await Lounge.findOne({ url: normalizedUrl }).lean().exec();
  if (duplicate) {
    return res.status(409).json({
      message:
        "Duplicate URL found. Please choose a different title or username.",
    });
  }

  // Upload images to Cloudinary
  let profileUrl = "";
  let backgroundUrl = "";

  try {
    if (req.files?.profile) {
      const profileUpload = await uploadImage(
        req.files.profile[0].path,
        "lounges/profiles"
      );
      profileUrl = profileUpload.secure_url;
    }
    if (req.files?.background) {
      const backgroundUpload = await uploadImage(
        req.files.background[0].path,
        "lounges/backgrounds"
      );
      backgroundUrl = backgroundUpload.secure_url;
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Image upload failed. Please ensure the images are in the correct format and try again.",
      error,
    });
  }

  // Create and store new lounge
  const lounge = await Lounge.create({
    user: parsedUser, // Store the parsed user object
    title,
    description,
    buttons: parsedButtons, // Store the parsed buttons (default empty array if not provided)
    icons: parsedIcons, // Store the parsed icons (default empty array if not provided)
    profile: profileUrl,
    background: backgroundUrl,
    theme,
    isPublic,
    url: normalizedUrl,
  });

  res.status(201).json({
    message: `${lounge.title} created successfully with URL: ${lounge.url}`,
    lounge,
  });
});

const updateLounge = asyncHandler(async (req, res) => {
  const { id, user, title, description, buttons, icons, theme, isPublic } =
    req.body;
  // Parse buttons and icons (if provided), otherwise default to empty arrays
  const parsedUser = user ? JSON.parse(user) : null;
  const parsedButtons = buttons ? JSON.parse(buttons) : []; // Default to empty array if not provided
  const parsedIcons = icons ? JSON.parse(icons) : []; // Default to empty array if not provided

  if (!id || !parsedUser || !title) {
    return res.status(400).json({
      message:
        "ID, user, and title are required. Please provide these fields to update the lounge.",
    });
  }

  const lounge = await Lounge.findById(id).exec();
  if (!lounge) {
    return res.status(404).json({
      message: "Lounge not found. Please verify the lounge ID and try again.",
    });
  }

  // Normalize the URL based on the updated title and username
  const normalizedUrl =
    parsedUser.username.toLowerCase().replace(/\s+/g, "-") +
    "/" +
    title.toLowerCase().replace(/\s+/g, "-");

  // Handle profile image upload and deletion
  try {
    if (req.files?.profile) {
      // If the profile image is different, delete the old image (if exists) and upload the new one
      if (lounge.profile && lounge.profile !== req.files.profile[0].path) {
        const publicId = lounge.profile
          .split("/upload/")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0]; // Remove the version and file extension
        await deleteImage(publicId); // Delete old image from Cloudinary
      }
      const profileUpload = await uploadImage(
        req.files.profile[0].path,
        "lounges/profiles"
      );
      lounge.profile = profileUpload.secure_url;
    } else if (req.body.profile === "null") {
      if (lounge.profile) {
        const publicId = lounge.profile
          .split("/upload/")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
        await deleteImage(publicId); // Delete old image from Cloudinary
      }
      lounge.profile = null;
    }

    // Handle background image upload and deletion
    if (req.files?.background) {
      if (
        lounge.background &&
        lounge.background !== req.files.background[0].path
      ) {
        const publicId = lounge.background
          .split("/upload/")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
        await deleteImage(publicId);
      }
      const backgroundUpload = await uploadImage(
        req.files.background[0].path,
        "lounges/backgrounds"
      );
      lounge.background = backgroundUpload.secure_url;
    } else if (req.body.background === "null") {
      if (lounge.background) {
        const publicId = lounge.background
          .split("/upload/")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
        await deleteImage(publicId); // Delete old image from Cloudinary
      }
      lounge.background = null;
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Image upload failed. Please try again.", error });
  }

  // Update other fields
  lounge.user = parsedUser;
  lounge.title = title;
  lounge.description = description;
  lounge.buttons = parsedButtons; // Updated buttons
  lounge.icons = parsedIcons; // Updated icons
  lounge.theme = theme;
  lounge.isPublic = isPublic;
  lounge.url = normalizedUrl; // Update URL

  const updatedLounge = await lounge.save();

  res.json({
    message: `${updatedLounge.title} updated successfully. New URL: ${updatedLounge.url}`,
    lounge: updatedLounge,
  });
});

// @desc Delete a lounge
// @route DELETE /lounges/:id
// @access Private
const deleteLounge = asyncHandler(async (req, res) => {
  const { id } = req.body; // Get the lounge ID from params

  // Confirm lounge exists to delete
  const lounge = await Lounge.findById(id).exec();

  if (!lounge) {
    return res.status(404).json({
      message: "Lounge not found. Please verify the lounge ID and try again.",
    });
  }

  const { title, profile, background, _id: loungeId } = lounge;

  // If there's a profile image, delete it from Cloudinary
  if (profile) {
    const publicId = profile
      .split("/upload/")[1]
      .split("/")
      .slice(1)
      .join("/")
      .split(".")[0];
    await deleteImage(publicId); // Delete old image from Cloudinary
  }

  if (background) {
    const publicId = background
      .split("/upload/")[1]
      .split("/")
      .slice(1)
      .join("/")
      .split(".")[0];
    await deleteImage(publicId); // Delete old image from Cloudinary
  }

  // Delete the lounge itself
  await lounge.deleteOne();

  res.json({
    message: `Lounge ${title} with ID ${loungeId} and associated images deleted successfully.`,
  });
});

// @desc Get lounges for a specific user
// @route GET /lounges/:user
// @access Private
const getLoungesByUser = asyncHandler(async (req, res) => {
  const { user } = req.params;

  // Validate if the logged-in user is trying to access their own lounges
  if (req.user !== user._id) {
    return res.status(403).json({
      message: "Unauthorized access. You can only access your own lounges.",
    });
  }

  try {
    const lounges = await Lounge.find({ user })
      .populate("user", "username")
      .lean();

    if (!lounges?.length) {
      return res.status(404).json({
        message:
          "No lounges found for this user. Please ensure the user has created lounges.",
      });
    }

    res.json(lounges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @desc Get a public lounge by username and title
// @route GET /lounges/:username/:title
// @access Public
const getPublicLounge = asyncHandler(async (req, res) => {
  const { username, title } = req.params;

  const url = `${username.toLowerCase()}/${title
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  try {
    const lounge = await Lounge.findOne({ url, isPublic: true }).lean();

    if (!lounge) {
      return res.status(404).json({
        message:
          "Public lounge not found. Please check the URL or availability.",
      });
    }

    res.json(lounge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @desc Make a lounge public or private
// @route PATCH /lounges/public
// @access Private
const makeLoungePublic = asyncHandler(async (req, res) => {
  const { loungeId, isPublic } = req.body;

  try {
    const lounge = await Lounge.findById(loungeId).exec();

    if (!lounge) {
      return res.status(404).json({
        message: "Lounge not found. Please verify the lounge ID and try again.",
      });
    }

    if (req.user.username !== lounge.username) {
      return res.status(403).json({
        message:
          "Unauthorized. You can only change visibility of your own lounge.",
      });
    }

    lounge.isPublic = isPublic;
    const updatedLounge = await lounge.save();

    res.json({
      message: `Lounge visibility updated to ${
        isPublic ? "public" : "private"
      }`,
      lounge: updatedLounge,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = {
  getAllLounges,
  createNewLounge,
  updateLounge,
  deleteLounge,
  getLoungesByUser,
  getPublicLounge,
  makeLoungePublic,
};
