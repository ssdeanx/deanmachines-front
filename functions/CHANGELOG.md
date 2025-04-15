# Changelog

All notable changes to the DeanMachines Mastra Backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.0.7] - 2025-04-15  

- Integrated UpstashVector as a modular vector store alongside LibSQL for hybrid memory and RAG workflows.  
- Refactored workflowFactory.ts for type safety, tracing, error handling, and modular dynamic workflow creation.  
- Added and re-exported Upstash vector helpers in database/index.ts for best-practice access.  
- Implemented tracing wrappers for memory operations in database/index.ts using SigNoz.  
- Improved type safety and error handling in workflowFactory.ts and related workflow logic.  
- Ensured all lint/type errors are fixed after every file edit.  
- Updated README and documentation to reflect new memory, RAG, and workflow patterns.  
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
- Improved code consistency across agent configuration files

### Security

- Updated dependencies to address potential vulnerabilities

## [0.0.1] - 2025-04-01

### Added

- Initial release of DeanMachines Mastra Backend
- Support for multiple specialized AI agents
- Integration with various external tools and services
- Memory management for persistent agent context
- Workflow orchestration capabilities
