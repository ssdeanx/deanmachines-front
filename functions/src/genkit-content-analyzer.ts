import { genkit, z } from "genkit";
import { vertexAI } from "@genkit-ai/vertexai";
import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

// Define secrets for API keys
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

/**
 * Interface defining content metadata for analysis
 */
interface ContentMetadata {
  title: string;
  description: string;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  readabilityScore: number;
  suggestedImprovements: string[];
}

/**
 * Type representing a content analysis result
 */
type ContentAnalysisResult = {
  metadata: ContentMetadata;
  summary: string;
  keyInsights: string[];
  contentQuality: {
    score: number;
    explanation: string;
  };
};

// Initialize GenKit with Vertex AI plugin
const ai = genkit({
  plugins: [
    vertexAI({
      location: "us-central1",
      // Use application default credentials in production
      // Project ID will be auto-detected from environment
    }),
  ],
});

// Define Gemini 2.0 models
// Note: Using proper model IDs for Gemini 2.0 models
const gemini20Flash = "gemini-2.0-flash" as const;
const gemini20Pro = "gemini-2.0-pro" as const;

/**
 * Content analyzer flow that performs deep content analysis using Gemini 2.0 models
 *
 * This flow analyzes content to extract metadata, generate summaries, identify key
 * insights, and assess content quality. It uses a combination of structured prompting
 * and streaming responses.
 */
const contentAnalyzerFlow = ai.defineFlow({
  name: "contentAnalyzerFlow",
  inputSchema: z.object({
    content: z.string().describe("The content to be analyzed"),
    contentType: z.enum(["article", "blog", "social", "documentation", "marketing"])
      .describe("The type of content being analyzed"),
    analysisDepth: z.enum(["basic", "standard", "deep"]).default("standard")
      .describe("How detailed the analysis should be"),
    focusAreas: z.array(z.string()).optional()
      .describe("Optional specific areas to focus analysis on"),
  }),
  outputSchema: z.object({
    metadata: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
      sentiment: z.enum(["positive", "neutral", "negative"]),
      readabilityScore: z.number().min(0).max(100),
      suggestedImprovements: z.array(z.string()),
    }),
    summary: z.string(),
    keyInsights: z.array(z.string()),
    contentQuality: z.object({
      score: z.number().min(0).max(100),
      explanation: z.string(),
    }),
  }),
  streamSchema: z.object({
    stage: z.string(),
    message: z.string(),
    progress: z.number().min(0).max(100).optional(),
  }),
}, async (input, { sendChunk }) => {
  const { content, contentType, analysisDepth, focusAreas } = input;

  // Create analysis configuration based on depth
  const maxTokens = analysisDepth === "deep" ? 4096 :
                    analysisDepth === "standard" ? 2048 : 1024;

  // Select model based on analysis depth
  const model = analysisDepth === "deep" ? gemini20Pro : gemini20Flash;

  // Track overall progress
  let overallProgress = 0;

  /**
   * Updates progress and sends progress notification chunk
   *
   * @param stage - Current processing stage
   * @param message - Status message
   * @param progressIncrement - How much to increment progress
   */
  const updateProgress = (stage: string, message: string, progressIncrement: number): void => {
    overallProgress += progressIncrement;
    overallProgress = Math.min(overallProgress, 100); // Cap at 100%

    sendChunk({
      stage,
      message,
      progress: overallProgress,
    });
  };

  // Begin analysis
  updateProgress("initialization", "Starting content analysis", 5);

  try {
    // Phase 1: Extract metadata
    updateProgress("metadata", "Extracting content metadata", 5);

    const metadataPrompt = `
    You are a content analysis expert. Extract the following metadata from this ${contentType}:

    Content: """
    ${content.slice(0, 15000)} ${content.length > 15000 ? '...(truncated)' : ''}
    """

    Provide a structured analysis with the following information:
    1. A suggested title (if not obvious from the content)
    2. A concise description (maximum 150 characters)
    3. 5-7 most relevant keywords as an array
    4. The overall sentiment (positive, neutral, or negative)
    5. A readability score from 0-100 (higher being more readable)

    Format your response as a valid JSON object with these exact keys:
    {
      "title": string,
      "description": string,
      "keywords": string[],
      "sentiment": "positive" | "neutral" | "negative",
      "readabilityScore": number
    }`;

    const metadataResponse = await ai.generate({
      model,
      prompt: metadataPrompt,
      config: {
        temperature: 0.1, // Low temperature for factual extraction
        maxOutputTokens: Math.min(maxTokens, 1024),
        responseFormat: { type: "json" },
      },
    });

    let metadata: Partial<ContentMetadata>;
    try {
      metadata = JSON.parse(metadataResponse.text) as Partial<ContentMetadata>;
      updateProgress("metadata", "Metadata extracted successfully", 15);
    } catch (error) {
      updateProgress("error", "Error parsing metadata response", 0);
      throw new Error(`Failed to parse metadata: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Phase 2: Generate summary and key insights
    updateProgress("summary", "Generating content summary", 10);

    const focusAreasText = focusAreas?.length
      ? `Focus especially on these areas: ${focusAreas.join(", ")}.`
      : "";

    const summaryPrompt = `
    Analyze this ${contentType} content and provide:
    1. A concise summary (maximum 300 words)
    2. 3-5 key insights or takeaways

    ${focusAreasText}

    Content: """
    ${content.slice(0, 20000)} ${content.length > 20000 ? '...(truncated)' : ''}
    """

    Format as JSON: { "summary": string, "keyInsights": string[] }`;

    const summaryResponse = await ai.generate({
      model,
      prompt: summaryPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: Math.min(maxTokens, 2048),
        responseFormat: { type: "json" },
      },
    });

    let summary: { summary?: string; keyInsights?: string[] } = {};
    try {
      summary = JSON.parse(summaryResponse.text);
      updateProgress("summary", "Summary and insights generated", 20);
    } catch (error) {
      updateProgress("error", "Error parsing summary response", 0);
      throw new Error(`Failed to parse summary: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Phase 3: Quality assessment and improvement suggestions
    updateProgress("quality", "Assessing content quality", 15);

    const qualityPrompt = `
    As a professional content analyst, evaluate this ${contentType} for quality and suggest improvements.

    Content: """
    ${content.slice(0, 15000)} ${content.length > 15000 ? '...(truncated)' : ''}
    """

    Provide:
    1. An overall quality score (0-100)
    2. A brief explanation for the score
    3. 3-6 specific suggestions for improving the content

    Format as JSON:
    {
      "contentQuality": {
        "score": number,
        "explanation": string
      },
      "suggestedImprovements": string[]
    }`;

    const qualityResponse = await ai.generate({
      model,
      prompt: qualityPrompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: Math.min(maxTokens, 2048),
        responseFormat: { type: "json" },
      },
    });

    let quality: { contentQuality?: { score: number; explanation: string }; suggestedImprovements?: string[] } = {};
    try {
      quality = JSON.parse(qualityResponse.text);
      updateProgress("quality", "Content quality assessment complete", 25);
    } catch (error) {
      updateProgress("error", "Error parsing quality assessment", 0);
      throw new Error(`Failed to parse quality assessment: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Phase 4: Final analysis streaming
    updateProgress("finalizing", "Assembling final analysis", 10);

    const result: ContentAnalysisResult = {
      metadata: {
        title: metadata.title || "Untitled Content",
        description: metadata.description || "No description provided",
        keywords: metadata.keywords || [],
        sentiment: metadata.sentiment || "neutral",
        readabilityScore: metadata.readabilityScore || 50,
        suggestedImprovements: quality.suggestedImprovements || [],
      },
      summary: summary.summary || "No summary generated",
      keyInsights: summary.keyInsights || [],
      contentQuality: quality.contentQuality || {
        score: 50,
        explanation: "No quality assessment provided",
      },
    };

    updateProgress("complete", "Content analysis complete", 5);

    return result;
  } catch (error) {
    // Handle any unexpected errors in the flow
    updateProgress("error", `Analysis failed: ${error instanceof Error ? error.message : String(error)}`, 0);
    throw error;
  }
});

/**
 * Exports a Firebase Function that provides content analysis capabilities
 * using GenKit and Vertex AI with Gemini 2.0 models.
 *
 * @example
 * // Client-side invocation:
 * const result = await firebase.functions().httpsCallable('contentAnalyzer')({
 *   content: "Article text goes here...",
 *   contentType: "article",
 *   analysisDepth: "standard"
 * });
 */
export const contentAnalyzer = onCallGenkit({
  secrets: [apiKey],
}, contentAnalyzerFlow);

/**
 * Example of a streaming flow that demonstrates Gemini 2.0's capabilities
 * for interactive content generation with real-time feedback.
 */
const interactiveCreatorFlow = ai.defineFlow({
  name: "interactiveCreatorFlow",
  inputSchema: z.object({
    topic: z.string().describe("The topic to generate content about"),
    contentFormat: z.enum(["blog", "social", "email", "script"]),
    toneStyle: z.enum(["professional", "casual", "enthusiastic", "technical"])
      .default("professional"),
    targetAudience: z.string().optional(),
    lengthGuide: z.enum(["brief", "standard", "detailed"]).default("standard"),
  }),
  outputSchema: z.string(),
  streamSchema: z.object({
    content: z.string(),
    completionPercentage: z.number().min(0).max(100),
  }),
}, async (input, { sendChunk }) => {
  const { topic, contentFormat, toneStyle, targetAudience, lengthGuide } = input;

  // Set appropriate length based on lengthGuide
  const approximateWordCount =
    lengthGuide === "brief" ? "150-250" :
    lengthGuide === "detailed" ? "600-800" : "300-500";

  // Create audience segment string if provided
  const audienceContext = targetAudience
    ? `The target audience is: ${targetAudience}.`
    : "Write for a general audience.";

  const prompt = `
  Create ${contentFormat} content about "${topic}".

  Style Requirements:
  - Use a ${toneStyle} tone
  - Length: approximately ${approximateWordCount} words
  - ${audienceContext}
  - Follow best practices for ${contentFormat} format
  - Include appropriate headings, bullet points, or formatting as needed for ${contentFormat}

  Generate high-quality, engaging content that provides value to the reader.
  `;

  // Use streaming generation with Gemini 2.0 Flash
  const { stream } = ai.generateStream({
    model: gemini20Flash,
    prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens:
        lengthGuide === "brief" ? 512 :
        lengthGuide === "detailed" ? 2048 : 1024,
    },
  });

  let fullContent = "";
  let totalExpectedTokens =
    lengthGuide === "brief" ? 300 :
    lengthGuide === "detailed" ? 1200 : 600;

  // Stream the content as it's generated
  for await (const chunk of stream) {
    fullContent += chunk.text;

    // Calculate approximate completion percentage
    const approximateTokens = fullContent.split(/\s+/).length;
    const completionPercentage = Math.min(
      Math.round((approximateTokens / totalExpectedTokens) * 100),
      99 // Cap at 99% until fully complete
    );

    // Send incremental content to the client
    sendChunk({
      content: fullContent,
      completionPercentage,
    });
  }

  // Send final content with 100% completion
  sendChunk({
    content: fullContent,
    completionPercentage: 100,
  });

  return fullContent;
});

/**
 * Exports a Firebase Function for interactive content creation
 * using Gemini 2.0 models with streaming capabilities.
 */
export const interactiveCreator = onCallGenkit({
  secrets: [apiKey],
}, interactiveCreatorFlow);
