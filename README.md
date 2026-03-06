# El País Scraper

This Node.js script demonstrates web scraping, API integration, and text processing using Selenium.

#Public Build Link: 
https://automate.browserstack.com/projects/SahilJadhav_BrowserStackAssignment/builds/El+Pais+Scraper+Build/1?public_token=ea1fb74e7c57d3ec3a2485c66272ffe090f579307762ed1d9f5dedd51014c53b

## Features

- Scrapes the first 5 articles from El País Opinion section.
- Downloads cover images if available.
- Translates article titles to English using Google Translate API.
- Analyzes translated headers for repeated words.
- Runs locally or on BrowserStack for cross-browser testing.

## Setup

1. Install dependencies: `npm install`
2. For local run: `npm start`
3. For BrowserStack: Set environment variables and run `npm start`

### Setting BrowserStack Credentials

To run on BrowserStack, set your username and access key as environment variables:

- **In WSL/Linux:**
  ```
  export BROWSERSTACK_USERNAME=your_username
  export BROWSERSTACK_ACCESS_KEY=your_access_key
  npm start
  ```


## Requirements

- Node.js
- Chrome browser for local testing
- BrowserStack account for cloud testing
