require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions.js");
const connectDB = require("./config/dbConn.js");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3500;

// Log the environment mode (e.g., development, production)
console.log(`Environment: ${process.env.NODE_ENV}`);

// Connect to MongoDB
connectDB();

// Middleware
app.use(logger); // Custom request logger
app.use(cors(corsOptions)); // CORS configuration
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies

// Serve static files from the "public" directory
app.use("/", express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/lounges", require("./routes/loungeRoutes"));

// Handle invalid paths
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "The requested resource was not found." });
  } else {
    res.type("txt").send("The requested resource was not found.");
  }
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection event handlers
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  console.log(`Connected to ${mongoose.connection.name}`);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  // Log MongoDB connection errors to a file
  console.error("MongoDB connection error:", err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
