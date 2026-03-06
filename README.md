# El País Scraper

This Node.js script demonstrates web scraping, API integration, and text processing using Selenium.

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

- **In Command Prompt (cmd):**
  ```
  set BROWSERSTACK_USERNAME=your_username
  set BROWSERSTACK_ACCESS_KEY=your_access_key
  npm start
  ```

- **In PowerShell:**
  ```
  $env:BROWSERSTACK_USERNAME = "your_username"
  $env:BROWSERSTACK_ACCESS_KEY = "your_access_key"
  npm start
  ```

- **In WSL/Linux:**
  ```
  export BROWSERSTACK_USERNAME=your_username
  export BROWSERSTACK_ACCESS_KEY=your_access_key
  npm start
  ```

Replace `your_username` and `your_access_key` with your actual BrowserStack credentials from your [BrowserStack account](https://automate.browserstack.com/dashboard).

## Requirements

- Node.js
- Chrome browser for local testing
- BrowserStack account for cloud testing
