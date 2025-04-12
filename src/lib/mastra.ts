import { MastraClient } from "@mastra/client-js";

/**
 * Mastra client configuration for static exports
 *
 * This setup uses @mastra/client-js to interact with a hosted Mastra API endpoint
 * instead of running a local server (which isn't available in static exports).
 *
 * For production, configure NEXT_PUBLIC_MASTRA_API_URL to point to your hosted Mastra API.
 */
export const mastraClient = new MastraClient({
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL || "https://api.deanmachines.com/mastra",
});

/**
 * Creates a client-side compatible wrapper for Mastra functionality
 * that can be used in static exports.
 *
 * @returns {Object} Mastra client-side API
 */
export const clientMastra = {
  /**
   * Get weather information for a specific city
   *
   * @param {string} city - The city to get weather for
   * @returns {Promise<any>} The weather response
   */
  getWeatherInfo: async (city: string): Promise<any> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.deanmachines.com/weather"}?city=${encodeURIComponent(city)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_API_KEY ? { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Weather API error:", error);
      return {
        error: true,
        message: error instanceof Error ? error.message : "Failed to fetch weather data"
      };
    }
  },

  /**
   * Stream chat completions for a given prompt
   *
   * @param {string} prompt - The user's prompt
   * @returns {Promise<ReadableStream>} A stream of completion chunks
   */
  streamChat: async (prompt: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_CHAT_API_URL || "https://api.deanmachines.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_API_KEY ? { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } : {}),
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      console.error("Chat API error:", error);
      const encoder = new TextEncoder();
      const message = error instanceof Error ? error.message : "Failed to connect to chat service";

      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ error: true, message })));
          controller.close();
        }
      });
    }
  }
};
