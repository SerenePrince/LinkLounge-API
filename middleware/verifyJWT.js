const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        message: "Unauthorized: Token missing or malformed",
        reason: "The request does not contain a valid Bearer token.",
      },
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      let errorMessage = "Forbidden: Invalid token";
      let errorReason = "The provided token is invalid or expired.";

      if (err.name === "TokenExpiredError") {
        errorMessage = "Unauthorized: Token expired";
        errorReason = "The provided token has expired. Please log in again.";
      } else if (err.name === "JsonWebTokenError") {
        errorMessage = "Unauthorized: Invalid token";
        errorReason = "The token provided is malformed or not valid.";
      }

      return res.status(403).json({
        error: {
          message: errorMessage,
          reason: errorReason,
          details: err.message, // Include the error message for debugging
        },
      });
    }

    // Attach the decoded user information to the request object
    req.user = decoded.UserInfo.username;
    req.email = decoded.UserInfo.email;

    next();
  });
};

module.exports = verifyJWT;
