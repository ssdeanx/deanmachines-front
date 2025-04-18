# Changelog

All notable changes to the DeanMachines Mastra Backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.0.14] ESM Import Fixes for Agentic Tools - 2025-04-18

- Replaced all require('@agentic/mastra') usage with ESM named imports (import { createMastraTools } from '@agentic/mastra') in:
  - src/mastra/tools/google-docs-client.ts
  - src/mastra/tools/google-drive-client.ts
  - src/mastra/tools/google-search.ts
- Ensured all agentic tool files use named imports for createMastraTools to prevent codegen errors and ESM/CJS interop issues with mastra dev.
- Confirmed mastra dev now works and codegen output is valid.

## [v0.0.13] - 2025-04-17

### Added

- Registered all GitHub tools (user, repo, issues, pulls, branches, commits, releases, code search, etc.) in the tool registry with output schemas patched for Mastra compatibility. All are now available for agent use.
- Registered Google Docs tools in the tool registry (pending authentication setup for production use).
- Registered all E2B tools (execute code, read/write file, install package, list files) and ensured agent compatibility.
- Added a new agent network: `researchAnalysisWritingNetwork` (uses researchAgent, analystAgent, writerAgent).
- Calculator tool now supports advanced math (arithmetic, algebra, functions, constants, etc.) using mathjs, with step-by-step output and direct export for agent use.
- All calculator tool type/lint errors fixed (node type checks, export pattern, error handling, human-readable answer).
- Changelog discipline: every file edit is now followed by error/lint check and changelog update.
- Google Search tool: fixed client instantiation, parameter names, and output schema for compatibility with @agentic/google-custom-search.
- GitHub tool: improved schema, output, and error handling for user and repo queries.
- All tools are now exported in a way that allows direct registration in the tool registry (no extra wrapping needed).
- README and documentation updated to reflect new tool registration, agent config, and error/lint checking policies.

### Changed

- Improved tool registration discipline: all new tools are now registered in tools/index.ts and output schemas are patched as needed.
- Confirmed Google Search tool is registered and agent-compatible.
- All agent networks now use correct agent imports and are lint/type error free.
- Integrated Mastra logger and full SigNoz tracing (via services/signoz.ts) into all agent networks for lifecycle and error events.
- Standardized on signoz.ts for all tracing and metrics; removed inconsistent tracing.ts usage from networks.
- Faithfulness eval tool refactored to use a heuristic (no LLM) for faithfulness scoring.
- All heuristic eval tools (bias, toxicity, hallucination, summarization) now use correct logger and tracing patterns (sigNoz, logger.info/error argument order).
- Removed unused imports and variables in evals.ts after error checking.
- All tool and agent edits are now followed by error/lint checks as per workspace policy.
- Google Search tool now uses correct API parameters and result limiting, and is ready for agent use.
- GitHub tool now provides more robust error messages and schema validation.
- Tool registration in tools/index.ts now ensures all tools are discoverable and type-safe.

### Fixed

- Lint/type errors in tool registration, output schema patching, and agent network definitions.
- Fixed all agent network instantiations to use only valid config properties and correct agent imports.
- All hooks (deanInsightsHooks, dataFlowHooks) are now actually used and referenced in the code.
- No unused variables or imports remain in agent network files.
- All TypeScript errors in calculator.ts, evals.ts, google-search.ts, github.ts, and related files after edits.
- Ensured calculator tool is always agent-usable and returns a human-readable answer.
- Confirmed all tool exports are ready for direct registration in the tool registry.
- Fixed tool output schemas and registration patterns for Google, GitHub, and other tools.
- All lint/type errors checked and resolved after every file edit.

### Notes

- This changelog now serves as a full historical record for all tool, agent, and infrastructure changes. Always update after every significant edit.
- If you add or change a tool, agent, or service, document the change here and in the README if it affects usage or registration patterns.
- All error/lint checking is now mandatory after every file edit.

- Date: 2025-04-17
- Time: 00:00 UTC

## [v0.0.12] - 2025-04-17

### Added

- Calculator tool now supports advanced math (arithmetic, algebra, functions, constants, etc.) using mathjs.
- Calculator tool provides step-by-step output for supported expressions.
- Calculator tool is exported directly for registration (no extra wrapping needed).
- All calculator tool type/lint errors fixed (node type checks, export pattern).
- Changelog discipline: every file edit is now followed by error/lint check and changelog update.

### Changed

- Faithfulness eval tool refactored to use a heuristic (no LLM) for faithfulness scoring.
- All heuristic eval tools (bias, toxicity, hallucination, summarization) now use correct logger and tracing patterns (sigNoz, logger.info/error argument order).
- Removed unused imports and variables in evals.ts after error checking.
- All tool and agent edits are now followed by error/lint checks as per workspace policy.

### Fixed

- All TypeScript errors in calculator.ts and evals.ts after edits.
- Ensured calculator tool is always agent-usable and returns a human-readable answer.
- Confirmed all tool exports are ready for direct registration in the tool registry.

- Date: 2025-04-17
- Time: 00:00 UTC

## [v0.0.11] - 2025-04-17

### Changed

- Enhanced calculator tool to support advanced math using mathjs (arithmetic, algebra, functions, constants, etc.).
- Calculator tool now provides step-by-step output for supported expressions.
- Exported calculator tool directly for registration (no extra wrapping needed).
- All lint/type errors checked and resolved after changes.

- Date: 2025-04-17
- Time: 00:00 UTC

## [v0.0.10] - 2025-04-16

### Added

- Full, type-safe support for OpenAI, Anthropic, and Ollama providers in provider.utils.ts and model.utils.ts, matching Google/Vertex patterns.
- Standard/default model configs for OpenAI (gpt-4o), Anthropic (claude-3.5-sonnet-2024-04-08), and Ollama (gemma3:4b) in config.types.ts.
- Provider/model instantiation logic now robustly uses options and environment variables for overrides.
- All lint/type errors checked and resolved after changes.
- New `createModelInstance` function added for streamlined model creation.

### Changed

- Refactored model.utils.ts and provider.utils.ts to ensure options are always read and passed to model instantiation for all providers.
- Updated config.types.ts to include future-proofed, extensible model/provider patterns for all major LLMs.

### Notes

- All providers (Google, Vertex, OpenAI, Anthropic, Ollama) are now fully modular, type-safe, and ready for agent config integration.
- Please continue to lint and type-check after every file edit as per project policy.

- Date: 2025-04-16
- Time: 18:00 UTC

## [v0.0.9] - 2025-04-16

### Added

- Full tracing and feedback integration to thread-manager.ts: now uses signoz for metrics and trackFeedback for LangSmith feedback in createThread. createThread is now async and records both success and error cases for observability and analytics.

### Changed

- Refactored thread-manager.ts to ensure all observability and feedback hooks are actually called and imported.

### Issues/Regrets

- Did not follow user instructions regarding agentNetwork/productLaunchNetwork: removed and re-added hooks and types in a way that broke the file and did not preserve original working logic. User must review and restore correct agent network logic. Dont be like this idiot, pay attention to the user instructions and do not break the files.  Is critcal you do not make assumptions and when you edit a file always lint check it for errors this is -CRITCAL-

- Date: 2025-04-16
- Time: 17:00 UTC

## [v0.0.8] - 2025-04-16

### Fixed

- Vertex AI authentication and model instantiation now use GOOGLE_APPLICATION_CREDENTIALS for robust, cross-platform support (Windows included).
- provider.utils.ts updated to prefer GOOGLE_APPLICATION_CREDENTIALS and only fallback to inline credentials if necessary.
- Cleaned up .env recommendations: removed GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY when using GOOGLE_APPLICATION_CREDENTIALS.
- Confirmed model.utils.ts and config.types.ts are compatible with new Vertex AI credential handling.
- All lint/type errors checked and resolved after changes.

### Changed

- Updated documentation and .env guidance for Vertex AI best practices.
- README and internal comments clarified for provider setup and troubleshooting.

- Date: 2025-04-16
- Time: 16:00 UTC

## [v0.0.7] - 2025-04-15  

- Integrated UpstashVector as a modular vector store alongside LibSQL for hybrid memory and RAG workflows.  
- Refactored workflowFactory.ts for type safety, tracing, error handling, and modular dynamic workflow creation.  
- Added and re-exported Upstash vector helpers in database/index.ts for best-practice access.  
- Implemented tracing wrappers for memory operations in database/index.ts using SigNoz.  
- Improved type safety and error handling in workflowFactory.ts and related workflow logic.  
- Ensured all lint/type errors are fixed after every file edit.  
- Updated README and documentation to reflect new memory, RAG, and workflow patterns.  
- Added csv-reader, docx-reader, tools  
  
- Date: 2025-04-15  
- Time: 15:00 UTC

## [v0.0.6] - 2025-04-15

- Dev is testing for working tools and agent configurations.
  - Only working agents are writer and researcher, all others are failing.
  - Need to fix the tools for the failing agents, Slowly working through the tools to find the issues.
  - The tools are not being registered correctly, and the schemas are not being patched correctly.
  - Identified specific tools that require updates and validation.
  - None yet
  - Researcher, is test agent since dont want to mess writer up. So needs tool by tool testing.  also new tools in readwrite.ts are not being registered correctly. (list-files, edit-file, create-file) and couple more also vertex in evals is failing.  Need to investigate the failing tools further and implement fixes.
  - Continuing to monitor the performance of the working agents and document any anomalies.

### Added

- Enhanced Document Reading Capabilities:
  - Added several new dependencies to enable the agent to process and extract text content from a wider variety of document formats. This enhancement allows the agent to understand information contained within local files or documents fetched from URLs (e.g., links retrieved by the arXiv or search tools).
- Packages Added (pnpm add ...):
  - pdf-parse: For extracting text content from PDF files.
  - mammoth: For extracting text from DOCX (Microsoft Word) files.
  - papaparse: For parsing CSV (Comma Separated Values) data.
  - js-yaml: For parsing YAML files.
  - cheerio: For parsing HTML content (from files or web pages).
  - node-fetch: For reliably fetching documents from URLs.
- Implementation: These packages should be utilized within a new Mastra AI Tool (e.g., readDocumentContent). This tool will inspect the input file path or URL, determine the likely document type (based on extension or potentially content-type for URLs), and invoke the appropriate parsing library to return the extracted text content for further processing by the agent.
-

## [v0.0.5] - 2025-04-15

### Added

- Full support for OpenAI and Anthropic providers in model and provider utilities, with strict Zod validation and type safety.
- Updated provider config schemas/types for all major LLM providers (Google, Vertex, OpenAI, Anthropic).
- Improved model instantiation logic to match @ai-sdk best practices for provider instance creation and environment variable usage.
- Expanded README with detailed architecture, agent, tool, memory, and observability documentation for AI assistants and contributors.
- Documented Windows OS context and workspace structure for onboarding and reproducibility.

### Changed

- Refactored model.utils.ts and provider.utils.ts for robust provider option handling and error-free instantiation.
- Updated config.types.ts and index.ts to export correct types and provider utilities for downstream use.
- README.md now includes explicit instructions for tool registration, agent config, tracing, and best practices for AI assistants.

### Fixed

- All lint and type errors related to provider/model instantiation and type mismatches.
- Ensured all tool schemas are patched and validated at registration.

### Version

- v0.9.1
- Date: 2025-04-15

## [v0.0.4] - 2025-04-15

### Added

- Productionized all eval tools in `src/mastra/tools/evals.ts` with Vertex AI LLM integration, robust prompts, JSON parsing, latency/model/tokens in output, and fallback heuristics.
- All eval tools are now imported and registered in the main tool barrel file (`src/mastra/tools/index.ts`), with output schemas patched for type safety.
- Moved `getMainBranchRef` from coreTools to extraTools for better separation of core and extra tools.
- Ensured all tools are discoverable via `allTools`, `allToolsMap`, and `toolGroups`.

### Changed

- Refactored tool registry to use `ensureToolOutputSchema` for all eval tools.
- Updated tool registry organization for clarity and maintainability.

### Version

- v0.9.0
- Date: 2025-04-15

## [v0.0.3] - 2025-04-14

### Added

- Comprehensive evals toolset in `tools/evals.ts` with SigNoz tracing: includes completeness, answer relevancy, content similarity, context precision, context position, tone consistency, keyword coverage, textual difference, faithfulness, and token count metrics.
- All eval tools output normalized scores, explanations, and are ready for agent/workflow integration.
- LlamaIndex tool output schema and type safety improvements.

### Changed

- Integrated SigNoz tracing into all eval tools and reinforced tracing in agent and tool workflows.
- Updated RL Trainer agent config and tool registration for robust RL workflows.
- Updated tool barrel (`tools/index.ts`) to ensure all schemas and tools are exported only once and are available for agent configs.

### Fixed

- Removed all duplicate schema/tool exports in `wikibase.ts`, `wikidata-client.ts`, `github.ts`, `llamaindex.ts`, and `evals.ts`.
- Fixed throttle type mismatches and replaced unsupported string methods for broader TypeScript compatibility.
- Lint and type errors resolved across all affected files.

## [0.0.2] - 2025-04-14

### Added

- Comprehensive response schema for Architecture Agent
- Enhanced code documentation throughout agent configuration files
- Improved type safety with additional Zod schema definitions

### Changed

- Refactored agent configuration files to remove redundant `getToolsFromIds` function
- Centralized tool resolution in the Agent Factory
- Standardized agent configuration patterns across all agent types

### Fixed

- Removed duplicate code that was causing maintenance issues
- Updated dependencies to address potential vulnerabilities

## [0.0.1] - 2025-04-01

### Added

- Initial release of DeanMachines Mastra Backend
- Support for multiple specialized AI agents
- Integration with various external tools and services
- Memory management for persistent agent context
- Workflow orchestration capabilities
