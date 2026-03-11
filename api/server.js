require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("../database/db");
const articleRoutes = require("./routes/articles");
const logger = require("../utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/images", express.static(path.join(__dirname, "..", "images")));
app.use("/api", articleRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ElPais News Intelligence Platform API" });
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled API error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info(`API server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use. Stop the existing process or set a different PORT in .env.`);
        process.exit(1);
      }

      logger.error(`Server startup error: ${error.message}`);
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start API server: ${error.message}`);
    process.exit(1);
  }
}

startServer();

module.exports = app;
