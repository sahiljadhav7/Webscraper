require("dotenv").config();

const assert = require("assert");
const { scrapeOpinionArticles } = require("../scraper/scraper");

const capabilitiesMatrix = [
  {
    browserName: "Chrome",
    os: "Windows",
    osVersion: "11",
    sessionName: "Chrome Windows"
  },
  {
    browserName: "Firefox",
    os: "Windows",
    osVersion: "11",
    sessionName: "Firefox Windows"
  },
  {
    browserName: "Safari",
    os: "OS X",
    osVersion: "Ventura",
    sessionName: "Safari macOS"
  },
  {
    browserName: "safari",
    bstackOptions: {
      deviceName: "iPhone 14",
      realMobile: "true",
      osVersion: "16"
    },
    sessionName: "iPhone Safari"
  },
  {
    browserName: "chrome",
    bstackOptions: {
      deviceName: "Samsung Galaxy S23",
      realMobile: "true",
      osVersion: "13.0"
    },
    sessionName: "Android Chrome"
  }
];

describe("BrowserStack scraper matrix", function suite() {
  this.timeout(300000);

  before(function validateCredentials() {
    assert.ok(process.env.BROWSERSTACK_USERNAME, "BROWSERSTACK_USERNAME is required");
    assert.ok(process.env.BROWSERSTACK_ACCESS_KEY, "BROWSERSTACK_ACCESS_KEY is required");
    assert.ok(process.env.MONGODB_URI, "MONGODB_URI is required");
  });

  capabilitiesMatrix.forEach((capabilities) => {
    it(`scrapes opinion page on ${capabilities.sessionName}`, async () => {
      const articles = await scrapeOpinionArticles({
        browserstack: true,
        capabilities
      });

      assert.ok(Array.isArray(articles), "Scraper should return an array");
      assert.ok(articles.length > 0, "Expected at least one scraped article");
      assert.ok(articles[0].translatedTitle, "Translated title should exist");
    });
  });
});
