import { connect } from "puppeteer-core";
import { Hyperbrowser } from "@hyperbrowser/sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

(async () => {
  const session = await client.sessions.create();

  const browser = await connect({
    browserWSEndpoint: session.wsEndpoint,
    defaultViewport: null,
  });

  // Create a new page
  const [page] = await browser.pages();

  // Navigate to a website
  console.log("Navigating to Hacker News...");
  await page.goto("https://news.ycombinator.com/");
  const pageTitle = await page.title();
  console.log("Page title:", pageTitle);

  await page.close();
  await browser.close();
  console.log("Session completed!");
  await client.sessions.stop(session.id);
})().catch((error) => console.error(error.message));
