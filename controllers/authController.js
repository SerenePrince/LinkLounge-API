const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  let { username, password } = req.body;

  username = username.toLowerCase();

  if (!username || !password) {
    return res.status(400).json({
      error: {
        message:
          "Both username and password fields are required. Please provide valid credentials to log in.",
      },
    });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(401).json({
      error: {
        message:
          "Invalid credentials. No account found with the provided username. Please check your username and try again.",
      },
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(401).json({
      error: {
        message:
          "Invalid credentials. The password does not match our records. Please check your password and try again.",
      },
    });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({
      error: {
        message:
          "No refresh token found. Please log in again to obtain a new refresh token.",
      },
    });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        let errorMessage =
          "Forbidden: Invalid refresh token. Please log in again to get a new token.";

        if (err.name === "TokenExpiredError") {
          errorMessage =
            "Unauthorized: Your refresh token has expired. Please log in again.";
        }

        return res.status(403).json({
          error: {
            message: errorMessage,
            details: err.message,
          },
        });
      }

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) {
        return res.status(401).json({
          error: {
            message:
              "No user found for the provided refresh token. Please log in again.",
          },
        });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(204).json({
      message: "No refresh token found in cookies to clear.",
    });
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({
    message:
      "Logged out successfully. Your session has been terminated, and the refresh token has been cleared.",
  });
};

// @desc Forgot Password
// @route POST /auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      error: {
        message:
          "Invalid email. Please provide a valid email address for password reset.",
      },
    });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(404).json({
      error: {
        message:
          "No account found with the provided email. Please check your email address and try again.",
      },
    });
  }

  const resetToken = jwt.sign(
    { email: foundUser.email },
    process.env.PASSWORD_RESET_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smpt.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: foundUser.email,
      subject: "Password Reset Request",
      text: `Dear User,\n\nWe received a request to reset your password. You can reset your password using the link below:\n\n${resetLink}\n\nIf you did not request this password reset, please contact our support team immediately to secure your account.\n\nBest regards,\nThe Link Lounge Team`,
      html: `
        <p>Dear User,</p>
        <p>We received a request to reset your password. You can reset your password by clicking the button below:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #025373; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        <p>If the button above does not work, please copy and paste the following link into your web browser:</p>
        <p><a href="${resetLink}" style="color: #025373;">${resetLink}</a></p>
        <p>If you did not initiate this request, please contact our support team immediately to ensure the security of your account.</p>
        <p>Best regards,<br>The LinkLounge Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "A password reset email has been sent successfully. Please check your inbox for further instructions.",
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message:
          "An error occurred while sending the password reset email. Please try again later.",
        details: err.message,
      },
    });
  }
});

// @desc Reset Password
// @route POST /auth/reset-password
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      error: {
        message: "Both token and password are required to reset your password.",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_SECRET);
    const user = await User.findOne({ email: decoded.email }).exec();

    if (!user) {
      return res.status(404).json({
        error: {
          message:
            "No user found for the provided reset token. Please check the token and try again.",
        },
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message:
        "Your password has been reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    res.status(400).json({
      error: {
        message:
          "Invalid or expired reset token. Please request a new password reset.",
        details: err.message,
      },
    });
  }
});

// @desc Forgot Username
// @route POST /auth/forgot-username
// @access Public
const forgotUsername = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: {
        message:
          "Email is required for username recovery. Please provide a valid email address.",
      },
    });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(404).json({
      error: {
        message:
          "No account found with the provided email. Please check your email address and try again.",
      },
    });
  }

  // Send username via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smpt.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: foundUser.email,
    subject: "Your Requested Username Recovery",
    text: `Dear User,\n\nWe have received a request to retrieve your username. Below is your account username:\n\n${foundUser.username}\n\nIf you did not initiate this request, please contact our support team immediately to ensure the security of your account.\n\nBest regards,\nThe Link Lounge Team`,
    html: `
      <p>Dear User,</p>
      <p>We have received a request to retrieve your username. Below is your account username:</p>
      <h2 style="color: #025373; font-weight: 600;">${foundUser.username}</h2>
      <p>If you did not initiate this request, please contact our support team immediately to ensure the security of your account.</p>
      <p>Best regards,<br>The LinkLounge Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  res.json({
    message: "Your username has been sent to the provided email address.",
  });
});

const sendFeedback = asyncHandler(async (req, res) => {
  const { username, type, body } = req.body;

  // Validate inputs
  if (!username || !type || !body) {
    return res.status(400).json({
      error: {
        message: "Username, type, and body fields are required.",
      },
    });
  }

  // Find user by username
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) {
    return res.status(404).json({
      error: {
        message: "No account found with the provided username.",
      },
    });
  }

  if (!foundUser.email) {
    return res.status(400).json({
      error: {
        message: "No email associated with the provided user.",
      },
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email to the user
  const userMailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: foundUser.email,
    subject: "We received your feedback",
    text: `Dear ${foundUser.username},\n\nThank you for your feedback! We have received your message and will review it shortly.\n\nBest regards,\nThe LinkLounge Team`,
    html: `
      <p>Dear ${foundUser.username},</p>
      <p>Thank you for your feedback! We have received your message and will review it shortly.</p>
      <p>Best regards,<br>The LinkLounge Team</p>
    `,
  };

  // Email to the info inbox
  const infoMailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.EMAIL_USERNAME, // Send to your info inbox
    subject: `New ${type} from ${foundUser.username}`,
    text: `Username: ${foundUser.username}\nEmail: ${foundUser.email}\nType: ${type}\n\nMessage:\n${body}`,
    html: `
      <p><strong>Username:</strong> ${foundUser.username}</p>
      <p><strong>Email:</strong> ${foundUser.email}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Message:</strong></p>
      <p>${body.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    // Send confirmation email to user
    await transporter.sendMail(userMailOptions);

    // Send feedback email to info inbox
    await transporter.sendMail(infoMailOptions);

    res.json({
      message:
        "Feedback submitted successfully. A confirmation email has been sent to the user.",
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message:
          "An error occurred while sending the emails. Please try again later.",
        details: err.message,
      },
    });
  }
});

module.exports = {
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  forgotUsername,
  sendFeedback,
};
