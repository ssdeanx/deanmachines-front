import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import sigNoz from "../services/signoz";

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

// Answer Relevancy Eval (placeholder, LLM-based in production)
export const answerRelevancyEvalTool = createTool({
  id: "answer-relevancy-eval",
  description: "Evaluates if the response addresses the query appropriately.",
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
      // Placeholder: score 1 if output contains any input word, else 0
      const inputWords = context.input.split(/\s+/);
      const output = context.output;
      const matched = inputWords.filter(word => output.includes(word));
      const score = inputWords.length > 0 ? matched.length / inputWords.length : 0;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Matched ${matched.length} of ${inputWords.length} input words.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in answer relevancy eval" };
    }
  },
});

// Context Precision Eval (placeholder)
export const contextPrecisionEvalTool = createTool({
  id: "context-precision-eval",
  description: "Evaluates how precisely the response uses provided context.",
  inputSchema: z.object({
    response: z.string(),
    context: z.array(z.string()),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.contextPrecision", { evalType: "context-precision" });
    const startTime = performance.now();
    try {
      const matches = context.context.filter(ctx => context.response.includes(ctx));
      const score = context.context.length > 0 ? matches.length / context.context.length : 0;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Matched ${matches.length} of ${context.context.length} context items.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in context precision eval" };
    }
  },
});

// Context Position Eval (placeholder)
export const contextPositionEvalTool = createTool({
  id: "context-position-eval",
  description: "Evaluates how well the model uses ordered context (earlier positions weighted more).",
  inputSchema: z.object({
    response: z.string(),
    context: z.array(z.string()),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.contextPosition", { evalType: "context-position" });
    const startTime = performance.now();
    try {
      let weightedSum = 0;
      let maxSum = 0;
      for (let i = 0; i < context.context.length; i++) {
        const weight = 1 / (i + 1);
        maxSum += weight;
        if (context.response.includes(context.context[i])) {
          weightedSum += weight;
        }
      }
      const score = maxSum > 0 ? weightedSum / maxSum : 0;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Weighted sum: ${weightedSum.toFixed(2)} of ${maxSum.toFixed(2)}.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in context position eval" };
    }
  },
});

// Tone Consistency Eval (placeholder: checks if all sentences have same sentiment)
export const toneConsistencyEvalTool = createTool({
  id: "tone-consistency-eval",
  description: "Analyzes sentiment consistency within the response.",
  inputSchema: z.object({
    response: z.string(),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.toneConsistency", { evalType: "tone-consistency" });
    const startTime = performance.now();
    try {
      // Placeholder: if all sentences end with '!' or '.', consider consistent
      const sentences = context.response.split(/[.!?]/).filter(Boolean);
      const exclam = sentences.filter(s => s.trim().endsWith('!')).length;
      const period = sentences.filter(s => s.trim().endsWith('.')).length;
      const max = Math.max(exclam, period);
      const score = sentences.length > 0 ? max / sentences.length : 1;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Most common ending: ${max} of ${sentences.length} sentences.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in tone consistency eval" };
    }
  },
});

// Keyword Coverage Eval (placeholder: ratio of keywords present)
export const keywordCoverageEvalTool = createTool({
  id: "keyword-coverage-eval",
  description: "Measures the ratio of required keywords present in the response.",
  inputSchema: z.object({
    response: z.string(),
    keywords: z.array(z.string()),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(1),
    explanation: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const span = sigNoz.createSpan("eval.keywordCoverage", { evalType: "keyword-coverage" });
    const startTime = performance.now();
    try {
      const matches = context.keywords.filter(kw => context.response.includes(kw));
      const score = context.keywords.length > 0 ? matches.length / context.keywords.length : 0;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Matched ${matches.length} of ${context.keywords.length} keywords.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in keyword coverage eval" };
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

// Faithfulness Eval (placeholder: checks if all reference tokens are present)
export const faithfulnessEvalTool = createTool({
  id: "faithfulness-eval",
  description: "Measures if the response faithfully includes all reference facts.",
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
      const refTokens = context.reference.split(/\s+/);
      const respTokens = context.response.split(/\s+/);
      const missing = refTokens.filter(token => !respTokens.includes(token));
      const score = refTokens.length > 0 ? 1 - missing.length / refTokens.length : 1;
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "success" });
      span.end();
      return { score, explanation: `Missing ${missing.length} of ${refTokens.length} reference tokens.`, success: true };
    } catch (error) {
      sigNoz.recordMetrics(span, { latencyMs: performance.now() - startTime, status: "error", errorMessage: error instanceof Error ? error.message : String(error) });
      span.end();
      return { score: 0, success: false, error: error instanceof Error ? error.message : "Unknown error in faithfulness eval" };
    }
  },
});
