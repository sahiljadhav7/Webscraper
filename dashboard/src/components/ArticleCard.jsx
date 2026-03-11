import React from "react";

function ArticleCard({ article }) {
  return (
    <article className="article-card">
      {article.image ? <img src={article.image} alt={article.title} className="article-image" /> : null}
      <div className="article-body">
        <h3>{article.title}</h3>
        <p className="translated">{article.translatedTitle}</p>
        <p className="meta">Sentiment: {article.sentimentScore}</p>
        <a href={article.source} target="_blank" rel="noreferrer">
          Read source
        </a>
      </div>
    </article>
  );
}

export default ArticleCard;
