import React, { useEffect, useState } from "react";
import { fetchArticles, fetchWordFrequency, fetchSentimentDistribution } from "./api";
import ArticleCard from "./components/ArticleCard";
import ChartsPanel from "./components/ChartsPanel";

function App() {
  const [articles, setArticles] = useState([]);
  const [wordFrequency, setWordFrequency] = useState([]);
  const [sentimentDistribution, setSentimentDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [articlesResponse, frequencyResponse, sentimentResponse] = await Promise.all([
          fetchArticles(),
          fetchWordFrequency(),
          fetchSentimentDistribution()
        ]);

        setArticles(articlesResponse.data || []);
        setWordFrequency(frequencyResponse.data || []);
        setSentimentDistribution(sentimentResponse.data || {});
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <main className="container">Loading dashboard...</main>;
  }

  if (error) {
    return <main className="container error">{error}</main>;
  }

  return (
    <main className="container">
      <header>
        <h1>ElPais News Intelligence Platform</h1>
        <p>Opinion article intelligence across scraping, NLP, and visualization.</p>
      </header>

      <ChartsPanel wordFrequency={wordFrequency} sentimentDistribution={sentimentDistribution} />

      <section>
        <h2>Latest Articles</h2>
        <div className="cards-grid">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
