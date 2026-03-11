# ElPais News Intelligence Platform

Production-style Node.js system that scrapes opinion articles from El Pais, runs NLP analytics, stores data in MongoDB, and exposes data via an API and React dashboard.

## Architecture

```text
.
├── scraper
│   ├── scraper.js
│   ├── translator.js
│   ├── imageDownloader.js
│   └── scheduler.js
├── api
│   ├── server.js
│   ├── routes
│   │   └── articles.js
│   └── controllers
│       └── articleController.js
├── database
│   ├── db.js
│   └── articleModel.js
├── analysis
│   ├── sentiment.js
│   ├── keywordExtraction.js
│   └── wordFrequency.js
├── dashboard
│   └── React frontend (Vite)
├── tests
│   └── browserstackTests.js
├── docker
│   └── Dockerfile
├── logs
├── images
├── utils
│   └── logger.js
├── package.json
├── .env
└── README.md
```

## Public Build Link: 

https://automate.browserstack.com/projects/SahilJadhav_BrowserStackAssignment/builds/El+Pais+Scraper+Build/1?public_token=ea1fb74e7c57d3ec3a2485c66272ffe090f579307762ed1d9f5dedd51014c53b

## Features

- Scrapes first 5 articles from `https://elpais.com/opinion/` using Selenium WebDriver.
- Extracts title, content, source link, image, translated title.
- Downloads article images to `/images`.
- Translates Spanish titles to English via `translate` package.
- Runs sentiment analysis, keyword extraction, and word-frequency analytics.
- Stores article records in MongoDB with Mongoose.
- Exposes REST APIs using Express + MVC.
- React dashboard with article cards and Chart.js analytics views.
- BrowserStack test matrix for desktop and mobile browsers.
- Scheduler via node-cron (every 24 hours by default).
- Winston logging to `/logs`.

## API Endpoints

- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/articles/search?q=keyword`
- `GET /api/analytics/word-frequency`
- `GET /api/analytics/sentiment-distribution`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Review and update `.env` if needed.
3. Start MongoDB locally (or set remote URI in `.env`).
4. Run API only:
   ```bash
   npm run start:api
   ```
5. Run scheduler (scrape now + every 24h):
   ```bash
   npm run start:scheduler
   ```
6. Run both API and scheduler:
   ```bash
   npm run start:all
   ```
7. Run one-time scrape:
   ```bash
   npm run scrape
   ```

## Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Set `VITE_API_BASE_URL` if API is not running on `http://localhost:5000/api`.

## BrowserStack Tests

1. Configure `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, and `MONGODB_URI`.
2. In WSL/Linux you can export BrowserStack credentials with:
   ```bash
   export BROWSERSTACK_USERNAME=your_username
   export BROWSERSTACK_ACCESS_KEY=your_access_key
   ```
3. Run:
   ```bash
   npm run test:browserstack
   ```

Browsers/devices covered:
- Chrome (Windows)
- Firefox (Windows)
- Safari (Mac)
- iPhone Safari
- Android Chrome

## Docker

Build and run:

```bash
docker build -f docker/Dockerfile -t elpais-platform .
docker run --env-file .env -p 5000:5000 elpais-platform
```

Container runs API server and scraper scheduler together.

## Environment Variables

See `.env` for the environment variables, including:
- `MONGODB_URI`
- `PORT`
- `SCRAPER_CRON`
- `USE_BROWSERSTACK`
- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`
- `TRANSLATE_ENGINE`
- `TRANSLATE_API_URL`

## Technologies Used

- Node.js, Express, Mongoose
- Selenium WebDriver, Axios, Cheerio
- sentiment, natural
- Winston, node-cron
- React, Vite, Chart.js
- BrowserStack Automate
- Docker
