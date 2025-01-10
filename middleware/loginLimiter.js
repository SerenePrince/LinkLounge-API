const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_MAX || 5, // Limit each IP to 5 login requests per window
  message: {
    message:
      "Too many login attempts from this IP, please try again in 60 seconds",
  },
  handler: (req, res, next, options) => {
    const ipAddress = req.ip;
    const attemptsLeft = options.max - req.rateLimit.current; // Number of attempts remaining
    const reason = "Too many login attempts"; // Specify the reason for failure
    const method = req.method;
    const url = req.url;
    const origin = req.headers.origin;

    // Log the event with detailed information
    logEvents(
      `Rate Limit Exceeded: ${reason}\tIP: ${ipAddress}\tMethod: ${method}\tURL: ${url}\tOrigin: ${origin}\tAttempts Left: ${attemptsLeft}\tTime: ${new Date().toISOString()}`,
      "rateLimiter.log"
    );

    // Send a response with a more descriptive error message
    res.status(options.statusCode || 429).send({
      error: {
        message: options.message.message,
        reason: reason,
        attemptsLeft: attemptsLeft,
        retryAfter: Math.ceil(options.windowMs / 1000), // Retry time in seconds
      },
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
