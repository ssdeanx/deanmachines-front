"use client";

import { clientMastra } from "@/lib/mastra";

/**
 * Client-side function to get weather information
 * Compatible with static exports
 *
 * @param city - The city to get weather for
 * @returns The weather data response
 */
export async function getWeatherInfo(city: string) {
  return await clientMastra.getWeatherInfo(city);
}
