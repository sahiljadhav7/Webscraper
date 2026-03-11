const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const stopWords = new Set(natural.stopwords);

function normalizeToken(token) {
  return token.toLowerCase().replace(/[^a-zA-Z0-9áéíóúñü]/g, "");
}

function extractKeywords(text, limit = 10) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const tokens = tokenizer
    .tokenize(text)
    .map(normalizeToken)
    .filter((token) => token.length > 3 && !stopWords.has(token));

  const frequency = new Map();
  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

module.exports = { extractKeywords };
