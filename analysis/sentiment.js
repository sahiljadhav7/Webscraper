const Sentiment = require("sentiment");

const sentiment = new Sentiment();

function analyzeSentiment(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  const { comparative } = sentiment.analyze(text);
  return Number(comparative.toFixed(4));
}

module.exports = { analyzeSentiment };
