const mongoose = require("mongoose");
const logger = require("../utils/logger");

let connected = false;

async function connectDB() {
  if (connected) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables.");
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "elpais_news_intelligence"
    });
    connected = true;
    logger.info("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

module.exports = connectDB;
