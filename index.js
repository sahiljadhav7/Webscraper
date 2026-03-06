const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
// const translate = require("translate");

async function scrapeArticles(driver) {
  await driver.get("https://elpais.com/opinion/");

  // Wait for articles to load
  await driver.wait(until.elementLocated(By.css(".c-d")), 10000);

  let articles = await driver.findElements(By.css(".c-d"));
  if (articles.length > 5) articles = articles.slice(0, 5);

  let articleData = [];

  // Collect links first
  let links = [];
  for (let article of articles) {
    try {
      let titleElement = await article.findElement(By.css("h2 a"));
      let title = await titleElement.getText();
      let link = await titleElement.getAttribute("href");
      links.push({ title, link });
    } catch (e) {
      console.log("Error getting link:", e.message);
    }
  }

  // Now visit each link
  for (let { title, link } of links) {
    try {
      await driver.get(link);

      // Wait for content
      await driver.wait(until.elementLocated(By.css(".a_c")), 10000);
      let contentElement = await driver.findElement(By.css(".a_c"));
      let content = await contentElement.getText();

      // Try to download image
      try {
        let imgElement = await driver.findElement(By.css(".a_m img"));
        let imgUrl = await imgElement.getAttribute("src");
        let imgResponse = await axios.get(imgUrl, { responseType: "stream" });
        let imgName =
          title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50) + ".jpg";
        let imgPath = path.join(__dirname, "images", imgName);
        imgResponse.data.pipe(fs.createWriteStream(imgPath));
        console.log(`Downloaded image for: ${title}`);
      } catch (e) {
        console.log(`No image for: ${title}`);
      }

      articleData.push({ title, content });
    } catch (e) {
      console.log(`Error scraping article: ${title}`, e.message);
    }
  }

  return articleData;
}

async function translateTitles(articleData) {
  const translate = (await import("translate")).default;
  for (let art of articleData) {
    try {
      art.translatedTitle = await translate(art.title, {
        from: "es",
        to: "en",
      });
      console.log(`Original: ${art.title}`);
      console.log(`Translated: ${art.translatedTitle}`);
    } catch (e) {
      console.log(`Translation failed for: ${art.title}`, e.message);
      art.translatedTitle = art.title; // fallback
    }
  }
}

function analyzeHeaders(articleData) {
  let allWords = articleData
    .map((a) => a.translatedTitle)
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
  let wordCount = {};
  allWords.forEach((w) => {
    if (w.length > 2) wordCount[w] = (wordCount[w] || 0) + 1;
  });
  let repeated = Object.keys(wordCount).filter((w) => wordCount[w] > 2);
  console.log("Repeated words (more than 2 times):");
  repeated.forEach((w) => console.log(`${w}: ${wordCount[w]}`));
}

async function runLocal() {
  console.log("Running locally...");
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().addArguments("--headless"))
    .build();
  try {
    let articleData = await scrapeArticles(driver);
    await translateTitles(articleData);
    analyzeHeaders(articleData);
  } finally {
    await driver.quit();
  }
}

async function runOnBrowserStack(capabilities) {
  let driver = await new Builder()
    .usingServer("https://hub-cloud.browserstack.com/wd/hub")
    .withCapabilities(capabilities)
    .build();
  try {
    let articleData = await scrapeArticles(driver);
    await translateTitles(articleData);
    analyzeHeaders(articleData);

    // Mark test as passed
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason":"Web scraping and translation completed successfully"}}',
    );
  } catch (error) {
    console.error("Error during test:", error.message);

    // Mark test as failed
    try {
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason":"' +
          error.message +
          '"}}',
      );
    } catch (e) {
      console.log("Could not update session status:", e.message);
    }
  } finally {
    await driver.quit();
  }
}

async function main() {
  if (
    process.env.BROWSERSTACK_USERNAME &&
    process.env.BROWSERSTACK_ACCESS_KEY
  ) {
    console.log("Running on BrowserStack...");
    // Define 5 capabilities
    const capabilitiesList = [
      {
        browserName: "Chrome",
        "bstack:options": {
          os: "Windows",
          osVersion: "10",
          browserVersion: "latest",
          buildName: "El Pais Scraper Build",
          sessionName: "El Pais Scraper - Chrome Desktop",
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
      },
      {
        browserName: "Firefox",
        "bstack:options": {
          os: "Windows",
          osVersion: "10",
          browserVersion: "latest",
          buildName: "El Pais Scraper Build",
          sessionName: "El Pais Scraper - Firefox Desktop",
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
      },
      {
        browserName: "Safari",
        "bstack:options": {
          os: "OS X",
          osVersion: "Ventura",
          browserVersion: "latest",
          buildName: "El Pais Scraper Build",
          sessionName: "El Pais Scraper - Safari Desktop",
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
      },
      {
        deviceName: "iPhone 14",
        browserName: "Safari",
        "bstack:options": {
          osVersion: "16",
          buildName: "El Pais Scraper Build",
          sessionName: "El Pais Scraper - Safari Mobile",
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
      },
      {
        deviceName: "Google Pixel 7",
        browserName: "Chrome",
        "bstack:options": {
          osVersion: "13.0",
          buildName: "El Pais Scraper Build",
          sessionName: "El Pais Scraper - Chrome Mobile",
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
      },
    ];

    // Run in parallel
    await Promise.all(capabilitiesList.map((cap) => runOnBrowserStack(cap)));
  } else {
    await runLocal();
  }
}

main().catch(console.error);
