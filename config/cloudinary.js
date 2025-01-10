const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * @param {string} filePath - Path of the image file.
 * @param {string} folder - Cloudinary folder to upload the image to.
 * @returns {Promise<Object>} - Cloudinary response with image details.
 */
const uploadImage = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false, // Use original file name (change this to true if you want Cloudinary to generate a unique name)
    });
    return result; // Return the result to get the URL
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

/**
 * Deletes an image from Cloudinary.
 * @param {string} publicId - Public ID of the Cloudinary image.
 * @returns {Promise<Object>} - Cloudinary response.
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Image delete failed");
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
