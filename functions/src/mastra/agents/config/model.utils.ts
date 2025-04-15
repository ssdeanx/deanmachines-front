/**
 * Model Utility Functions
 *
 * This module provides utility functions for creating AI model instances
 * based on configuration settings, supporting multiple providers.
 *
 * @module model.utils
 */

import { google } from "@ai-sdk/google";
import { vertex } from "@ai-sdk/google-vertex";
import { OpenAIProviderConfig, AnthropicProviderConfig } from "./provider.utils";
import { ModelConfig } from "./config.types";

/**
 * Model creation options
 */
export interface ModelCreationOptions {
  /** Project ID for Vertex AI */
  vertexProjectId?: string;

  /** Location for Vertex AI */
  vertexLocation?: string;

  /** Google API key */
  googleApiKey?: string;
}

/**
 * Creates a model instance based on the provided configuration
 *
 * @param modelConfig - Configuration for the model
 * @param options - Additional options for model creation
 * @returns A model instance compatible with @mastra/core/agent
 * @throws {Error} If the model provider is unsupported or configuration is invalid
 */
export function createModelFromConfig(
  modelConfig: ModelConfig,
  options: ModelCreationOptions = {}
): any {
  try {
    const { provider, modelId, providerOptions } = modelConfig;
    switch (provider) {
      case "google":
        return google(modelId);
      case "vertex":
        return vertex(modelId);
      case "openai": {
        if (providerOptions && (providerOptions as OpenAIProviderConfig).apiKey) {
          const openai = require("@ai-sdk/openai").openai({
            apiKey: (providerOptions as OpenAIProviderConfig).apiKey,
            baseUrl: (providerOptions as OpenAIProviderConfig).baseUrl,
          });
          return openai.chat(modelId as any);
        }
        return require("@ai-sdk/openai").openai.chat(modelId as any);
      }
      case "anthropic": {
        if (providerOptions && (providerOptions as AnthropicProviderConfig).apiKey) {
          const anthropic = require("@ai-sdk/anthropic").anthropic({
            apiKey: (providerOptions as AnthropicProviderConfig).apiKey,
            baseUrl: (providerOptions as AnthropicProviderConfig).baseUrl,
          });
          return anthropic.messages(modelId as any);
        }
        return require("@ai-sdk/anthropic").anthropic.messages(modelId as any);
      }
      default:
        throw new Error(`Unsupported model provider: ${provider}`);
    }
  } catch (error) {
    throw new Error(
      `Failed to create model: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Creates a Google AI model instance with default settings
 *
 * @param modelId - Model ID to use
 * @param apiKey - Optional Google API key (otherwise uses environment variable)
 * @param options - Additional model options
 * @returns A Google AI model instance
 */
export function createGoogleModel(
  modelId: string,
  apiKey?: string,
  options?: Record<string, unknown>
): ReturnType<typeof google> {
  return createModelFromConfig(
    {
      provider: "google",
      modelId,
      ...options,
    },
    { googleApiKey: apiKey }
  ) as ReturnType<typeof google>;
}

/**
 * Creates a Google Vertex AI model instance with default settings
 *
 * @param modelId - Model ID to use
 * @param projectId - Optional Vertex project ID (otherwise uses GOOGLE_VERTEX_PROJECT env var)
 * @param location - Optional Vertex location (otherwise uses GOOGLE_VERTEX_LOCATION env var or default)
 * @param options - Additional model options
 * @returns A Google Vertex AI model instance
 */
export function createVertexModel(
  modelId: string,
  projectId?: string,
  location?: string,
  options?: Record<string, unknown>
): ReturnType<typeof vertex> {
  return createModelFromConfig(
    {
      provider: "vertex",
      modelId,
      ...options,
    },
    {
      vertexProjectId: projectId,
      vertexLocation: location
    }
  ) as ReturnType<typeof vertex>;
}

/**
 * Creates a model instance based on the model configuration
 * This is an alias for createModelFromConfig with a more concise name
 *
 * @param config - Model configuration
 * @param options - Optional creation options
 * @returns A model instance for the specified provider
 */
export function createModelInstance(
  config: ModelConfig,
  options: ModelCreationOptions = {}
): any {
  return createModelFromConfig(config, options);
}
