const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

function normalizeToken(token) {
  return token.toLowerCase().replace(/[^a-zA-Z0-9áéíóúñü]/g, "");
}

function computeWordFrequency(titles = [], limit = 20) {
  const frequency = new Map();

  for (const title of titles) {
    const tokens = tokenizer.tokenize(title || "");
    for (const rawToken of tokens) {
      const token = normalizeToken(rawToken);
      if (!token || token.length < 3) {
        continue;
      }
      frequency.set(token, (frequency.get(token) || 0) + 1);
    }
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

module.exports = { computeWordFrequency };
