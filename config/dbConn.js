const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI); // No need for deprecated options anymore
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
