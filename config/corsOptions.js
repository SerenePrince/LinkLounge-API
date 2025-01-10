const allowedOrigins = require("./allowedOrigins.js");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from allowed origins or no origin (e.g., Postman, server-to-server requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} is not allowed`));
    }
  },
  credentials: true, // Allow cookies and credentials in requests
  optionsSuccessStatus: 200, // For older browsers that choke on 204
};

module.exports = corsOptions;
