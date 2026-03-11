import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:5000";

const EVENT_STYLES = {
  "scrape:start":        { icon: "🚀", color: "#60a5fa" },
  "scrape:info":         { icon: "ℹ️",  color: "#a3a3a3" },
  "scrape:link_found":   { icon: "🔗", color: "#818cf8" },
  "scrape:article":      { icon: "✅", color: "#34d399" },
  "scrape:translate":    { icon: "🌐", color: "#fbbf24" },
  "scrape:save":         { icon: "💾", color: "#38bdf8" },
  "scrape:done":         { icon: "🎉", color: "#4ade80" },
  "scrape:error":        { icon: "❌", color: "#f87171" },
};

function LogEntry({ entry }) {
  const style = EVENT_STYLES[entry.event] || { icon: "•", color: "#e5e7eb" };
  const time = new Date(entry.timestamp).toLocaleTimeString();

  return (
    <div className="log-entry" style={{ borderLeftColor: style.color }}>
      <span className="log-icon">{style.icon}</span>
      <span className="log-message" style={{ color: style.color }}>{entry.message}</span>
      <span className="log-time">{time}</span>
    </div>
  );
}

function ScrapeLivePanel({ onScrapeComplete }) {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [connected, setConnected] = useState(false);
  const logEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    const allEvents = Object.keys(EVENT_STYLES);

    allEvents.forEach((event) => {
      socket.on(event, (data) => {
        setLogs((prev) => [...prev, { event, ...data }]);

        if (event === "scrape:start") {
          setIsRunning(true);
        }
        if (event === "scrape:done" || event === "scrape:error") {
          setIsRunning(false);
          if (event === "scrape:done" && onScrapeComplete) {
            onScrapeComplete();
          }
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [onScrapeComplete]);

  // Auto-scroll as new logs arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  function clearLogs() {
    setLogs([]);
  }

  return (
    <section className="live-panel">
      <div className="live-panel-header">
        <div className="live-panel-title">
          <h2>Live Scraper</h2>
          <span className={`status-badge ${isRunning ? "running" : connected ? "idle" : "offline"}`}>
            {isRunning ? "● Scraping..." : connected ? "○ Idle" : "✕ Offline"}
          </span>
        </div>
        <button className="clear-btn" onClick={clearLogs} disabled={logs.length === 0}>
          Clear
        </button>
      </div>

      <div className="log-feed">
        {logs.length === 0 ? (
          <p className="log-empty">
            {connected
              ? "Waiting for scrape events... Click \"▶ Trigger Scrape\" to start."
              : "Connecting to server..."}
          </p>
        ) : (
          logs.map((entry, i) => <LogEntry key={i} entry={entry} />)
        )}
        <div ref={logEndRef} />
      </div>
    </section>
  );
}

export default ScrapeLivePanel;
