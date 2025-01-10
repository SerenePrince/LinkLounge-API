const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const buttonSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Button text is required"],
  },
  link: {
    type: String,
    required: [true, "Button link is required"],
  },
});

const iconSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: [true, "Icon is required"],
  },
  link: {
    type: String,
    required: [true, "Icon link is required"],
  },
});

const loungeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User", // Reference to the User model
    },
    profile: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      default: "My Lounge",
    },
    description: {
      type: String,
    },
    buttons: {
      type: [buttonSchema], // Subdocument validation
      validate: {
        validator: function (buttons) {
          // Allow empty array, but validate individual button objects if present
          return buttons.every((button) => button.text && button.link);
        },
        message: "Each button must have a text and link.",
      },
    },
    icons: {
      type: [iconSchema], // Subdocument validation
      validate: {
        validator: function (icons) {
          // Allow empty array, but validate individual icon objects if present
          return icons.every((icon) => icon.icon && icon.link);
        },
        message: "Each icon must have an icon and link.",
      },
    },
    background: {
      type: String, // Optional field, no validation needed
    },
    url: {
      type: String,
      unique: true,
      required: [true, "URL is required"],
      lowercase: true, // Store custom URLs in lowercase
      trim: true, // Remove any leading/trailing spaces
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String, // Store the theme file name like "winter-theme.css"
      default: "default",
    },
  },
  { timestamps: true }
);

// Auto-increment field for loungeId
loungeSchema.plugin(mongooseSequence, { inc_field: "loungeId" });

module.exports = mongoose.model("Lounge", loungeSchema);
