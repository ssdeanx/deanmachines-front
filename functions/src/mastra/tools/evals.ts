import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import sigNoz from "../services/signoz";
import { createVertexModel } from "../agents/config/model.utils";
import { generateText } from "ai";

// Helper to get modelId from env/config or use default
function getEvalModelId() {
  return process.env.EVAL_MODEL_ID || "models/gemini-2.0-flash-001";
}

// Utility: Token count (simple whitespace split)
export const tokenCountEvalTool = createTool({
  id: "token-count-eval",
  description: "Counts the number of tokens in a response.",
  inputSchema: z.object({
    response: z.string().describe("The agent's response to count tokens for."),
  }),
  outputSchema: z.object({
    tokenCount: z.number().int(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.tokenCount", { evalType: "token-count" });
    const startTime = performance.now();
    try {
      const tokenCount = context.response.trim().split(/\s+/).length;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { tokenCount, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { tokenCount: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in token count eval" };
    }
  },
});

// Completeness Eval
export const completenessEvalTool = createTool({
  id: "completeness-eval",
  description: "Evaluates the completeness of an agent's response against a reference answer.",
  inputSchema: z.object({
    response: z.string().describe("The agent's response to evaluate."),
    reference: z.string().describe("The reference or expected answer."),
    context: z.record(z.any()).optional().describe("Additional context for evaluation."),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1).describe("Completeness score (0-1)"),
    explanation: z.string().optional().describe("Explanation of the score."),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.completeness", { evalType: "completeness" });
    const startTime = performance.now();
    try {
      const refTokens = context.reference.split(/\s+/);
      const respTokens = context.response.split(/\s+/);
      const matched = refTokens.filter(token => respTokens.includes(token));
      const score = refTokens.length > 0 ? matched.length / refTokens.length : 0;
      const explanation = `Matched ${matched.length} of ${refTokens.length} reference tokens.`;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in completeness eval" };
    }
  },
});

// Content Similarity Eval (case/whitespace insensitive string similarity)
export const contentSimilarityEvalTool = createTool({
  id: "content-similarity-eval",
  description: "Evaluates string similarity between response and reference.",
  inputSchema: z.object({
    response: z.string(),
    reference: z.string(),
    ignoreCase: z.boolean().optional().default(true),
    ignoreWhitespace: z.boolean().optional().default(true),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.contentSimilarity", { evalType: "content-similarity" });
    const startTime = performance.now();
    try {
      let a = context.response;
      let b = context.reference;
      if (context.ignoreCase) { a = a.toLowerCase(); b = b.toLowerCase(); }
      if (context.ignoreWhitespace) { a = a.replace(/\s+/g, ""); b = b.replace(/\s+/g, ""); }
      const maxLen = Math.max(a.length, b.length);
      let matches = 0;
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) matches++;
      }
      const score = maxLen > 0 ? matches / maxLen : 0;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Matched ${matches} of ${maxLen} characters.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in content similarity eval" };
    }
  },
});

// Answer Relevancy Eval (using Vertex LLM)
export const answerRelevancyEvalTool = createTool({
  id: "answer-relevancy-eval",
  description: "Evaluates if the response addresses the query appropriately using Vertex LLM.",
  inputSchema: z.object({
    input: z.string().describe("The user query or prompt."),
    output: z.string().describe("The agent's response."),
    context: z.record(z.any()).optional(),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.answerRelevancy", { evalType: "answer-relevancy" });
    const startTime = performance.now();
    try {
      const model = createVertexModel("models/gemini-2.0-pro");
      const prompt = `Given the following user input and agent response, rate the relevancy of the response to the input on a scale from 0 (not relevant) to 1 (fully relevant). Provide a brief explanation.\n\nUser Input: ${context.input}\nAgent Response: ${context.output}\n\nReturn a JSON object: { \"score\": number (0-1), \"explanation\": string }`;
      const result = await generateText({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      let score = 0, explanation = "";
      try {
        const parsed = JSON.parse(result.text);
        score = typeof parsed.score === "number" ? parsed.score : 0;
        explanation = parsed.explanation || "";
      } catch {
        explanation = result.text;
      }
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in answer relevancy eval" };
    }
  },
});

// Refactored contextPrecisionEvalTool with Vertex LLM
export const contextPrecisionEvalTool = createTool({
  id: "context-precision-eval",
  description: "Evaluates how precisely the response uses provided context using Vertex LLM.",
  inputSchema: z.object({
    response: z.string(),
    context: z.array(z.string()),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    latencyMs: z.number().optional(),
    model: z.string().optional(),
    tokens: z.number().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.contextPrecision", { evalType: "context-precision" });
    const startTime = performance.now();
    const modelId = getEvalModelId();
    try {
      const model = createVertexModel(modelId);
      const prompt = `Given the following context items and agent response, rate how precisely the response uses the provided context on a scale from 0 (not precise) to 1 (fully precise). Provide a brief explanation.\n\nContext: ${JSON.stringify(context.context)}\nAgent Response: ${context.response}\n\nReturn only valid JSON: { \"score\": number (0-1), \"explanation\": string }`;
      const result = await generateText({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      const latencyMs = performance.now() - startTime;
      let score = 0, explanation = "", tokens = result.usage?.totalTokens || 0;
      try {
        const parsed = JSON.parse(result.text);
        score = typeof parsed.score === "number" ? parsed.score : 0;
        explanation = parsed.explanation || "";
      } catch {
        // fallback: heuristic
        const matches = context.context.filter(ctx => context.response.includes(ctx));
        score = context.context.length > 0 ? matches.length / context.context.length : 0;
        explanation = `LLM parse failed. Heuristic: Matched ${matches.length} of ${context.context.length} context items.`;
      }
      sigNoz.recordMetrics(span, { latencyMs, tokens, status: "success" });
      span.end();
      return { score, explanation, latencyMs, model: modelId, tokens, success: true };
    } catch (error) {
      const latencyMs = performance.now() - startTime;
      sigNoz.recordMetrics(span, { latencyMs, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in context precision eval", latencyMs, model: modelId };
    }
  },
});

// Refactored contextPositionEvalTool with Vertex LLM
export const contextPositionEvalTool = createTool({
  id: "context-position-eval",
  description: "Evaluates how well the model uses ordered context (earlier positions weighted more) using Vertex LLM.",
  inputSchema: z.object({
    response: z.string(),
    context: z.array(z.string()),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    latencyMs: z.number().optional(),
    model: z.string().optional(),
    tokens: z.number().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.contextPosition", { evalType: "context-position" });
    const startTime = performance.now();
    const modelId = getEvalModelId();
    try {
      const model = createVertexModel(modelId);
      const prompt = `Given the following ordered context items and agent response, rate how well the response uses the most important context items early in the response (earlier positions weighted more) on a scale from 0 (not well) to 1 (very well). Provide a brief explanation.\n\nContext: ${JSON.stringify(context.context)}\nAgent Response: ${context.response}\n\nReturn only valid JSON: { \"score\": number (0-1), \"explanation\": string }`;
      const result = await generateText({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      const latencyMs = performance.now() - startTime;
      let score = 0, explanation = "", tokens = result.usage?.totalTokens || 0;
      try {
        const parsed = JSON.parse(result.text);
        score = typeof parsed.score === "number" ? parsed.score : 0;
        explanation = parsed.explanation || "";
      } catch {
        // fallback: heuristic
        let weightedSum = 0;
        let maxSum = 0;
        for (let i = 0; i < context.context.length; i++) {
          const weight = 1 / (i + 1);
          maxSum += weight;
          if (context.response.includes(context.context[i])) {
            weightedSum += weight;
          }
        }
        score = maxSum > 0 ? weightedSum / maxSum : 0;
        explanation = `LLM parse failed. Heuristic: Weighted sum: ${weightedSum.toFixed(2)} of ${maxSum.toFixed(2)}.`;
      }
      sigNoz.recordMetrics(span, { latencyMs, tokens, status: "success" });
      span.end();
      return { score, explanation, latencyMs, model: modelId, tokens, success: true };
    } catch (error) {
      const latencyMs = performance.now() - startTime;
      sigNoz.recordMetrics(span, { latencyMs, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in context position eval", latencyMs, model: modelId };
    }
  },
});

// Refactored toneConsistencyEvalTool with Vertex LLM
export const toneConsistencyEvalTool = createTool({
  id: "tone-consistency-eval",
  description: "Analyzes sentiment/tone consistency within the response using Vertex LLM.",
  inputSchema: z.object({
    response: z.string(),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    latencyMs: z.number().optional(),
    model: z.string().optional(),
    tokens: z.number().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.toneConsistency", { evalType: "tone-consistency" });
    const startTime = performance.now();
    const modelId = getEvalModelId();
    try {
      const model = createVertexModel(modelId);
      const prompt = `Analyze the following agent response for tone and sentiment consistency. Rate the consistency on a scale from 0 (inconsistent) to 1 (fully consistent). Provide a brief explanation.\n\nAgent Response: ${context.response}\n\nReturn only valid JSON: { \"score\": number (0-1), \"explanation\": string }`;
      const result = await generateText({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      const latencyMs = performance.now() - startTime;
      let score = 0, explanation = "", tokens = result.usage?.totalTokens || 0;
      try {
        const parsed = JSON.parse(result.text);
        score = typeof parsed.score === "number" ? parsed.score : 0;
        explanation = parsed.explanation || "";
      } catch {
        // fallback: heuristic
        const sentences = context.response.split(/[.!?]/).filter(Boolean);
        const exclam = sentences.filter(s => s.trim().endsWith('!')).length;
        const period = sentences.filter(s => s.trim().endsWith('.')).length;
        const max = Math.max(exclam, period);
        score = sentences.length > 0 ? max / sentences.length : 1;
        explanation = `LLM parse failed. Heuristic: Most common ending: ${max} of ${sentences.length} sentences.`;
      }
      sigNoz.recordMetrics(span, { latencyMs, tokens, status: "success" });
      span.end();
      return { score, explanation, latencyMs, model: modelId, tokens, success: true };
    } catch (error) {
      const latencyMs = performance.now() - startTime;
      sigNoz.recordMetrics(span, { latencyMs, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in tone consistency eval", latencyMs, model: modelId };
    }
  },
});

// Refactored keywordCoverageEvalTool with Vertex LLM
export const keywordCoverageEvalTool = createTool({
  id: "keyword-coverage-eval",
  description: "Measures the ratio of required keywords present in the response using Vertex LLM.",
  inputSchema: z.object({
    response: z.string(),
    keywords: z.array(z.string()),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    latencyMs: z.number().optional(),
    model: z.string().optional(),
    tokens: z.number().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.keywordCoverage", { evalType: "keyword-coverage" });
    const startTime = performance.now();
    const modelId = getEvalModelId();
    try {
      const model = createVertexModel(modelId);
      const prompt = `Given the following required keywords and agent response, rate the coverage of the keywords in the response on a scale from 0 (none present) to 1 (all present and well integrated). Consider synonyms and related terms. Provide a brief explanation.\n\nKeywords: ${JSON.stringify(context.keywords)}\nAgent Response: ${context.response}\n\nReturn only valid JSON: { \"score\": number (0-1), \"explanation\": string }`;
      const result = await generateText({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      const latencyMs = performance.now() - startTime;
      let score = 0, explanation = "", tokens = result.usage?.totalTokens || 0;
      try {
        const parsed = JSON.parse(result.text);
        score = typeof parsed.score === "number" ? parsed.score : 0;
        explanation = parsed.explanation || "";
      } catch {
        // fallback: heuristic
        const matches = context.keywords.filter(kw => context.response.includes(kw));
        score = context.keywords.length > 0 ? matches.length / context.keywords.length : 0;
        explanation = `LLM parse failed. Heuristic: Matched ${matches.length} of ${context.keywords.length} keywords.`;
      }
      sigNoz.recordMetrics(span, { latencyMs, tokens, status: "success" });
      span.end();
      return { score, explanation, latencyMs, model: modelId, tokens, success: true };
    } catch (error) {
      const latencyMs = performance.now() - startTime;
      sigNoz.recordMetrics(span, { latencyMs, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in keyword coverage eval", latencyMs, model: modelId };
    }
  },
});

// Textual Difference Eval (Levenshtein distance normalized)
export const textualDifferenceEvalTool = createTool({
  id: "textual-difference-eval",
  description: "Measures the normalized Levenshtein distance between response and reference.",
  inputSchema: z.object({
    response: z.string(),
    reference: z.string(),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.textualDifference", { evalType: "textual-difference" });
    const startTime = performance.now();
    try {
      function levenshtein(a: string, b: string): number {
        const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
              matrix[i][j] = matrix[i - 1][j - 1];
            } else {
              matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + 1
              );
            }
          }
        }
        return matrix[a.length][b.length];
      }
      const dist = levenshtein(context.response, context.reference);
      const maxLen = Math.max(context.response.length, context.reference.length);
      const score = maxLen > 0 ? 1 - dist / maxLen : 1;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Levenshtein distance: ${dist} of ${maxLen} chars.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in textual difference eval" };
    }
  },
});

// Faithfulness Eval (using Vertex LLM)
export const faithfulnessEvalTool = createTool({
  id: "faithfulness-eval",
  description: "Measures if the response faithfully includes all reference facts using Vertex LLM.",
  inputSchema: z.object({
    response: z.string(),
    reference: z.string(),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.faithfulness", { evalType: "faithfulness" });
    const startTime = performance.now();
    try {
      const model = createVertexModel("models/gemini-2.0-pro");
      const prompt = `Given the following reference facts and agent response, rate the faithfulness of the response to the reference on a scale from 0 (not faithful) to 1 (fully faithful). Provide a brief explanation.\n\nReference: ${context.reference}\nAgent Response: ${context.response}\n\nReturn a JSON object: { \"score\": number (0-1), \"explanation\": string }`;
      const result = await generateText({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      let score = 0, explanation = "";
      try {
        const parsed = JSON.parse(result.text);
        score = typeof parsed.score === "number" ? parsed.score : 0;
        explanation = parsed.explanation || "";
      } catch {
        explanation = result.text;
      }
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in faithfulness eval" };
    }
  },
});