const express = require("express");
const controller = require("../controllers/articleController");

const router = express.Router();

router.get("/articles/search", controller.searchArticles);
router.get("/articles", controller.getArticles);
router.get("/articles/:id", controller.getArticleById);
router.get("/analytics/word-frequency", controller.getWordFrequency);
router.get("/analytics/sentiment-distribution", controller.getSentimentDistribution);

module.exports = router;
