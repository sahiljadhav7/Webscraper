import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function ChartsPanel({ wordFrequency, sentimentDistribution }) {
  const wordData = {
    labels: wordFrequency.map((item) => item.word),
    datasets: [
      {
        label: "Word Count",
        data: wordFrequency.map((item) => item.count),
        backgroundColor: "rgba(26, 115, 232, 0.75)"
      }
    ]
  };

  const wordOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentimentDistribution.positive || 0,
          sentimentDistribution.neutral || 0,
          sentimentDistribution.negative || 0
        ],
        backgroundColor: ["#2E7D32", "#F9A825", "#C62828"]
      }
    ]
  };

  return (
    <section className="charts-grid">
      <div className="chart-card">
        <h2>Word Frequency</h2>
        <Bar data={wordData} options={wordOptions} />
      </div>
      <div className="chart-card">
        <h2>Sentiment Distribution</h2>
        <Doughnut data={sentimentData} />
      </div>
    </section>
  );
}

export default ChartsPanel;
