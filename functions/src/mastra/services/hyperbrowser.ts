// File: hyperbrowser.ts
import { connect, Browser } from "puppeteer-core";
import { Hyperbrowser, SessionDetail } from "@hyperbrowser/sdk";

// Initialize the Hyperbrowser client
export const hyperbrowserClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

/**
 * Creates a new Hyperbrowser session.
 * @returns {Promise<SessionDetail>} The created session details.
 */
export async function createHyperbrowserSession(): Promise<SessionDetail> {
  try {
    console.info("Creating Hyperbrowser session...");
    const session = await hyperbrowserClient.sessions.create();
    console.info(`Hyperbrowser session created with ID: ${session.id}`);
    return session;
  } catch (error) {
    console.error("Failed to create Hyperbrowser session:", error);
    throw error; // Re-throw the error after logging
  }
}

/**
 * Connects to an existing Hyperbrowser session using Puppeteer.
 * @param session - The Hyperbrowser session details.
 * @returns {Promise<Browser>} The Puppeteer Browser instance.
 */
export async function connectToHyperbrowserSession(session: SessionDetail): Promise<Browser> {
  try {
    const browser = await connect({
      browserWSEndpoint: session.wsEndpoint,
      defaultViewport: null,
    });
    console.info(`Successfully connected to session: ${session.id}`);
    return browser;
  } catch (error) {
    console.error(`Failed to connect to Hyperbrowser session ${session.id}:`, error);
    throw error;
  }
}

/**
 * Stops a Hyperbrowser session.
 * @param sessionId - The ID of the session to stop.
 * @returns {Promise<void>}
 */
export async function stopHyperbrowserSession(sessionId: string): Promise<void> {
  try {
    await hyperbrowserClient.sessions.stop(sessionId);
    console.info(`Hyperbrowser session stopped: ${sessionId}`);
  } catch (error) {
    console.error(`Failed to stop Hyperbrowser session ${sessionId}:`, error);
    // Decide if stopping failure should throw or just be logged
    // For now, log and continue, but consider implications
  }
}

// Example usage (optional, can be removed or kept for testing)
// This IIFE demonstrates how to use the exported functions.
(async () => {
  let session: SessionDetail | null = null;
  let browser: Browser | null = null;
  try {
    session = await createHyperbrowserSession();
    browser = await connectToHyperbrowserSession(session);

    // Create a new page
    const [page] = await browser.pages();

    // Navigate to a website
    console.info("Navigating to Hacker News...");
    await page.goto("https://news.ycombinator.com/");
    const pageTitle = await page.title();
    console.info(`Page title: ${pageTitle}`);

    await page.close();
    console.info("Page closed.");

  } catch (error) {
    console.error("An error occurred during the Hyperbrowser example usage:", error instanceof Error ? error.message : error);
  } finally {
    // Ensure resources are cleaned up even if errors occur
    if (browser) {
      try {
        await browser.close();
        console.info("Browser connection closed.");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
    if (session) {
      await stopHyperbrowserSession(session.id);
    }
    console.info("Hyperbrowser example usage finished.");
  }
})().catch((error) => console.error("Unhandled error in Hyperbrowser example IIFE:", error));
