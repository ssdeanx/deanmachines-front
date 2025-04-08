/**
 * Mastra API Client
 *
 * This module serves as the integration layer between the frontend and the Mastra AI backend API.
 * It abstracts away the details of API communication and provides a clean interface for frontend components.
 *
 * @module api/mastra
 */

import { type ApiResponse, type ApiError } from "@/types/api";

/**
 * Base URL for the Mastra API
 * This should be configured via environment variables
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_MASTRA_API_URL || "http://localhost:4311";

/**
 * Default request timeout in milliseconds
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Configuration options for API requests
 */
export interface RequestOptions {
  /**
   * Authentication token to include in requests
   */
  token?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Signal object that allows you to abort the request
   */
  signal?: AbortSignal;
}

/**
 * Generic API request helper with error handling and timeout support
 *
 * @template T - The expected response data type
 * @param path - API endpoint path (without base URL)
 * @param method - HTTP method
 * @param data - Optional request body data
 * @param options - Request options including authentication
 * @returns Promise resolving to the API response data
 * @throws Will throw an error if the request fails or times out
 */
async function makeRequest<T>(
  path: string,
  method: string,
  data?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, timeout = DEFAULT_TIMEOUT, signal } = options;

  // Create URL with base and path
  const url = new URL(path, API_BASE_URL);

  // Set up headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    signal,
  };

  // Add body for non-GET requests
  if (data && method !== "GET") {
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    // Setup timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // If a signal was provided, listen for abort events from it
    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    // Use the controller's signal for the fetch request
    fetchOptions.signal = fetchOptions.signal || controller.signal;

    // Make the request
    const response = await fetch(url.toString(), fetchOptions);

    // Clear timeout since request completed
    clearTimeout(timeoutId);

    // Parse response as JSON
    const responseData = await response.json();

    // Check if request was successful
    if (!response.ok) {
      // Format error according to API error structure
      const error: ApiError = {
        status: response.status,
        message: responseData.message || "An unexpected error occurred",
        errors: responseData.errors,
      };

      throw error;
    }

    // Return successful response
    return {
      data: responseData as T,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    // Handle AbortError (timeout or manual abort)
    if (error instanceof DOMException && error.name === "AbortError") {
      throw {
        status: 408,
        message: "Request timeout",
      } as ApiError;
    }

    // Rethrow ApiError objects
    if ((error as ApiError).status) {
      throw error;
    }

    // Handle other errors
    throw {
      status: 0,
      message: (error as Error).message || "Network error",
    } as ApiError;
  }
}

/**
 * Get a new or existing thread ID for agent conversations
 *
 * @param options - Request options
 * @returns Promise resolving to an object containing the threadId
 */
export async function getThreadId(
  options: RequestOptions = {}
): Promise<{ threadId: string }> {
  // This is a placeholder implementation - real implementation will call the actual API
  // return makeRequest<{ threadId: string }>("/threads/create", "POST", {}, options);

  // For now, return a mock thread ID
  return Promise.resolve({ threadId: `thread-${Date.now()}` });
}

/**
 * Send a message to an AI agent
 *
 * @param threadId - The thread ID for the conversation
 * @param message - The message to send
 * @param agentId - Optional ID of the specific agent to target
 * @param options - Request options
 * @returns Promise resolving to the agent's response
 */
export async function sendMessageToAgent(
  threadId: string,
  message: string,
  agentId?: string,
  options: RequestOptions = {}
): Promise<{ response: string; threadId: string }> {
  // This is a placeholder implementation - real implementation will call the actual API
  /*
  return makeRequest<{ response: string; threadId: string }>(
    "/agents/message",
    "POST",
    { threadId, message, agentId },
    options
  );
  */

  // For now, return a mock response
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    response: `This is a mock response to your message: "${message}"`,
    threadId,
  };
}

/**
 * Get conversation history for a thread
 *
 * @param threadId - The thread ID to get history for
 * @param options - Request options
 * @returns Promise resolving to an array of conversation messages
 */
export async function getConversationHistory(
  threadId: string,
  options: RequestOptions = {}
): Promise<
  Array<{ role: "user" | "agent"; content: string; timestamp: string }>
> {
  // This is a placeholder implementation - real implementation will call the actual API
  /*
  return makeRequest<Array<{ role: "user" | "agent"; content: string; timestamp: string }>>(
    `/threads/${threadId}/history`,
    "GET",
    undefined,
    options
  ).then(response => response.data);
  */

  // For now, return mock conversation history
  return [
    {
      role: "user",
      content: "Hello, I need help with creating an AI agent",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      role: "agent",
      content:
        "Hi there! I'd be happy to help you create an AI agent. What type of agent are you looking to build?",
      timestamp: new Date(Date.now() - 50000).toISOString(),
    },
    {
      role: "user",
      content: "I need a research agent that can help with market analysis",
      timestamp: new Date(Date.now() - 40000).toISOString(),
    },
    {
      role: "agent",
      content:
        "A research agent for market analysis is a great choice. To get started, you'll need to define the data sources, key metrics, and specific markets you want to analyze.",
      timestamp: new Date(Date.now() - 30000).toISOString(),
    },
  ];
}

/**
 * Get dashboard metrics for the authenticated user
 *
 * @param options - Request options
 * @returns Promise resolving to dashboard metrics data
 */
export async function getDashboardMetrics(
  options: RequestOptions = {}
): Promise<{
  agents: number;
  activeThreads: number;
  messagesSent: number;
  apiCalls: number;
  usageData: Array<{ date: string; calls: number }>;
}> {
  // This is a placeholder implementation - real implementation will call the actual API
  /*
  return makeRequest<{
    agents: number;
    activeThreads: number;
    messagesSent: number;
    apiCalls: number;
    usageData: Array<{ date: string; calls: number }>;
  }>(
    "/dashboard/metrics",
    "GET",
    undefined,
    options
  ).then(response => response.data);
  */

  // For now, return mock dashboard metrics
  // Generate some random usage data for the past 7 days
  const usageData = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toISOString().split("T")[0],
      calls: Math.floor(Math.random() * 100) + 50,
    };
  });

  return {
    agents: 5,
    activeThreads: 12,
    messagesSent: 342,
    apiCalls: 1248,
    usageData,
  };
}

/**
 * Get the list of available agents
 *
 * @param options - Request options
 * @returns Promise resolving to an array of agent data
 */
export async function getAvailableAgents(options: RequestOptions = {}): Promise<
  Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    capabilities: string[];
  }>
> {
  // This is a placeholder implementation - real implementation will call the actual API
  /*
  return makeRequest<Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    capabilities: string[];
  }>>(
    "/agents",
    "GET",
    undefined,
    options
  ).then(response => response.data);
  */

  // For now, return mock agents list
  return [
    {
      id: "research-agent-1",
      name: "Research Assistant",
      description:
        "Specialized in gathering and synthesizing information from multiple sources",
      type: "research",
      capabilities: ["web_search", "document_analysis", "data_synthesis"],
    },
    {
      id: "analyst-agent-1",
      name: "Data Analyst",
      description: "Expert in analyzing and visualizing complex data sets",
      type: "analyst",
      capabilities: [
        "data_processing",
        "statistical_analysis",
        "chart_generation",
      ],
    },
    {
      id: "writer-agent-1",
      name: "Content Writer",
      description:
        "Creates high-quality written content based on provided topics and guidelines",
      type: "writer",
      capabilities: ["content_creation", "editing", "tone_adjustment"],
    },
    {
      id: "assistant-agent-1",
      name: "General Assistant",
      description:
        "Versatile agent that can handle a wide range of tasks and inquiries",
      type: "assistant",
      capabilities: ["task_management", "question_answering", "scheduling"],
    },
  ];
}

/**
 * Get analytics data for admin dashboard
 *
 * @param period - Time period for the analytics data (day, week, month, year)
 * @param options - Request options
 * @returns Promise resolving to analytics data
 */
export async function getAnalyticsData(
  period: "day" | "week" | "month" | "year" = "week",
  options: RequestOptions = {}
): Promise<{
  totalUsers: number;
  activeUsers: number;
  totalAgents: number;
  totalApiCalls: number;
  userGrowth: Array<{ date: string; count: number }>;
  apiUsage: Array<{ date: string; count: number }>;
  agentDistribution: Record<string, number>;
}> {
  // This is a placeholder implementation - real implementation will call the actual API
  /*
  return makeRequest<{
    totalUsers: number;
    activeUsers: number;
    totalAgents: number;
    totalApiCalls: number;
    userGrowth: Array<{ date: string; count: number }>;
    apiUsage: Array<{ date: string; count: number }>;
    agentDistribution: Record<string, number>;
  }>(
    "/admin/analytics",
    "GET",
    { period },
    options
  ).then(response => response.data);
  */

  // For now, return mock analytics data
  // Generate datа for the selected period
  const dataPoints =
    period === "day"
      ? 24
      : period === "week"
      ? 7
      : period === "month"
      ? 30
      : 12;

  const userGrowth = Array.from({ length: dataPoints }).map((_, index) => {
    const date = new Date();
    if (period === "day") {
      date.setHours(date.getHours() - (dataPoints - 1 - index));
    } else if (period === "week" || period === "month") {
      date.setDate(date.getDate() - (dataPoints - 1 - index));
    } else {
      // year
      date.setMonth(date.getMonth() - (dataPoints - 1 - index));
    }

    const dateString =
      period === "day"
        ? date.toISOString().split("T")[1].substring(0, 5)
        : date.toISOString().split("T")[0];

    return {
      date: dateString,
      count: Math.floor(Math.random() * 100) + 500 + index * 10, // Increasing trend
    };
  });

  const apiUsage = Array.from({ length: dataPoints }).map((_, index) => {
    const date = new Date();
    if (period === "day") {
      date.setHours(date.getHours() - (dataPoints - 1 - index));
    } else if (period === "week" || period === "month") {
      date.setDate(date.getDate() - (dataPoints - 1 - index));
    } else {
      // year
      date.setMonth(date.getMonth() - (dataPoints - 1 - index));
    }

    const dateString =
      period === "day"
        ? date.toISOString().split("T")[1].substring(0, 5)
        : date.toISOString().split("T")[0];

    return {
      date: dateString,
      count: Math.floor(Math.random() * 5000) + 10000 + index * 500, // Increasing trend
    };
  });

  return {
    totalUsers: 1245,
    activeUsers: 876,
    totalAgents: 2879,
    totalApiCalls: 1248000,
    userGrowth,
    apiUsage,
    agentDistribution: {
      research: 35,
      analyst: 28,
      writer: 22,
      assistant: 15,
    },
  };
}
