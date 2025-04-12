# Changelog

## [0.1.5] - 2025-04-12 (18:23 EST)

### Mastra AI Implementation with Firebase Functions

- **Core Implementation:**
  - Created Mastra backend architecture in `functions/src/mastra/` directory
  - Set up file structure for agents, tools, database, and workflows
  - Added Firebase Functions deployment for Mastra API hosting
  - Documented OpenAPI endpoint at http://localhost:4111/openapi.json

- **Mastra Integration Documentation:**
  - Enhanced Mastra Firebase integration guide
  - Added comprehensive Mastra Server documentation
  - Documented Firebase/Google Cloud implementation patterns

### Firebase Functions Implementation

- **Firebase Structure:**
  - Created Firebase Functions skeleton for Mastra deployment
  - Established directory structure for serverless Mastra deployment
  - Set up authentication and authorization for API endpoints

- **API Layer:**
  - Built client-side Mastra wrapper for static export compatibility
  - Created API routes for chat and tool interactions
  - Implemented streaming capabilities for AI responses

## [0.1.4] - 2025-04-13 (03:45 EST)

### Static Export Implementation

- **Static Export Configuration:**
  - Updated Next.js configuration to support static exports
  - Configured sitemap.ts to work with Firebase hosting using dynamic environment variables
  - Added proper basePath and production URL handling for static deployment
  - Created placeholder API routes for NextAuth compatibility with static exports

- **Authentication System:**
  - /lib/auth-client.ts: Refactored authentication client-side logic to fully support static exports
  - Eliminated server-side authentication dependencies for static export compatibility
  - Updated sign-in and sign-up components to use client-side Firebase Authentication
  - Implemented localStorage-based auth state persistence mechanism
  - Added client-side role management and token validation

- **Mastra AI Integration for Static Exports:**
  - Refactored `/lib/mastra.ts` to provide client-side compatible wrapper with fetch API
  - Created standalone client functions that replace server-side Mastra functionality
  - Added error handling and recovery mechanisms for client-side API calls
  - Implemented StreamChat component with real-time streaming capabilities
  - Added advanced UI with Tailwind CSS v4.1 styling and animations
  - Developed auto-growing textarea input and message formatting features
  - Integrated responsive design patterns for mobile compatibility
  - Set up environment variables for API endpoints to support hosted Mastra services
  - Implemented efficient state management for streaming responses
  - Created type-safe interfaces for chat message handling

### Enhanced

- **Solutions Configuration (`src/config/solutions.ts`):**
  - Comprehensively updated all solution sections with future-forward language for 2025
  - Added quantifiable benefits and metrics to each solution
  - Enhanced "Agentic AI for Financial Services" section with:
    - Detailed Mixture of Experts (MoE) and Reinforcement Learning (RL) descriptions
    - Explicit mentions of Mastra AI and Agentic.so frameworks
    - Quantifiable performance metrics for AI capabilities
  - Improved "Customer Service" solution with:
    - AI automation benefits
    - Quantifiable efficiency improvements
    - Enhanced technical descriptions
  - Refined "Data Processing" and "Enterprise AI" sections with:
    - More detailed use cases
    - Expanded technical specifications
    - Future-oriented language and framework mentions
  - Added comprehensive integrations across all solutions, including:
    - Cloud providers (Google Cloud, Azure, AWS)
    - AI platforms (OpenAI, Vertex AI, Anthropic)
    - Industry-specific tools

### Added

- Expanded integration logos and descriptions
- Included framework-specific highlights (Mastra AI, Agentic.so)
- Enhanced SEO-optimized descriptions for each solution

### Improved

- Consistent styling and structure across solution sections
- More compelling value propositions
- Quantifiable performance metrics for AI capabilities

## [0.1.3] - 2025-04-12 (22:45 EST)

### Added

- Created enterprise solutions page with cutting-edge Tailwind v4.1 styling and animations
- Enhanced TestimonialSlider component with modern UI interactions and accessibility improvements
- Added advanced animation effects to navigation indicators in TestimonialSlider

### Fixed

- Resolved TypeScript errors in NavBar component related to NavItem and NavItemChild interfaces
- Fixed alignment issues in NavBar for better responsiveness and accessibility
- Updated DocsSearch component with improved search functionality and user experience
- Enhanced Footer component with proper hydration handling to prevent client/server mismatches
- Corrected FaqAccordion component with modern styling and improved interaction patterns

### Changed

- Updated NavItemChild interface in nav.ts to include optional slug property for type consistency
- Improved NavBar component with modern glass morphism effects and responsive design
- Enhanced components with Tailwind v4.1 features including backdrop blur, improved gradients, and container queries
- Optimized animations throughout the interface for better performance and reduced motion when appropriate
- Standardized component architecture for better maintainability and code organization

## [0.1.2] - 2025-04-12 (18:30 EST)

### Added

- Added support for additional weather data metrics
- Enhanced Weather component UI with responsive design
- Implemented caching for weather API requests
- Added missing props (`language`, `filename`, `showLineNumbers`, `highlightLines`, `image`, `title`) to `CodeBlockWrapper` component to resolve TypeScript errors in documentation pages
- Made `href` prop optional in `Card` component to align with data structure
- **Implemented Authentication:**
  - Created `SignIn` component (`@/components/sign-in.tsx`) with Email/Password, Google, and GitHub options
  - Created `SignUp` component (`@/components/sign-up.tsx`) with Email/Password, Google, and GitHub options
  - Created Login page (`@/app/(public)/login/page.tsx`)
  - Created Signup page (`@/app/(public)/signup/page.tsx`)
  - Implemented custom API route (`@/app/api/auth/signup/route.ts`) for handling email/password user creation using Firebase Admin SDK
  - Configured NextAuth (`auth.ts`) with Credentials, Google, GitHub providers, Firestore adapter, and JWT session strategy
  - Implemented role assignment (admin/user) based on environment variable during signup/user creation

### Fixed

- **Authentication Dataflow:**
  - Fixed signup API route with improved error handling and user role management
  - Enhanced client-side signup component with better validation and error feedback
  - Added proper server-side validation for user credentials
  - Fixed JWT token generation and session handling in auth.ts

- **Documentation System:**
  - Completely resolved documentation sidebar duplication issue across all documentation pages
  - Fixed wrapper nesting issues in all documentation pages structure
  - Improved DocsSearch component with robust search results display and handling
  - Enhanced Toc component with better accessibility and highlighting

- **UI and Layout Components:**
  - Fixed hydration issues in NavBar by correcting useSession hook implementation
  - Fixed hydration issues in Footer component with proper year rendering
  - Updated breadcrumb.tsx with improved responsive design and accessibility
  - Enhanced CallToAction.tsx with proper client directive and styling
  - Fixed IconWrapper.tsx for better compatibility with Tailwind v4.1
  - Updated ServiceCard.tsx with modern animations and responsive behavior
  - Enhanced FeatureGrid.tsx with consistent grid layouts

- **Tailwind CSS v4.1:**
  - Fixed alignment issues in layout components with better CSS variables
  - Enhanced globals.css with comprehensive variable definitions and mappings
  - Added explicit width variables for sidebar components
  - Improved responsive media queries for consistent layouts

### Changed

- Optimized Mastra agent response handling
- Updated documentation for weather functionality
- **Refactored documentation pages (`/src/app/(public)/docs/**/page.tsx`)**
  - Replaced MDX rendering (`Mdx`, `DocsPageLayout`) with structured content rendering using `DocPage` and `ContentRenderer`
  - Standardized page structure to fetch `DocContent` and render using `<DocPage>`
  - Updated fallback logic for missing documents
  - Ensured consistent use of `<DocsLayoutWrapper>` within pages
- **Fixed issues in documentation components and types:**
  - Imported `createTool` in `src/mastra/tools/index.ts`
  - Updated `CalloutType` enum values in `src/lib/content-data.ts` to match component expectations (`default`, `danger`)
  - Explicitly typed `fallbackDoc` in `/docs/page.tsx` to resolve type incompatibility
- Removed redundant `<DocsLayoutWrapper>` from `/docs/layout.tsx`
- Removed unused `docsConfig` import from `/docs/layout.tsx`
- **Corrected Firebase setup:** Removed redundant/incorrect `firebase.ts`, ensuring distinct client (`client.ts`) and admin (`admin.ts`) initializations
- **Updated Middleware (`middleware.ts`):** Added `/signup` to public routes and ensured logged-in users are redirected from auth pages. Added explicit allowance for `/api/auth/signup`
- **Fixed Component Errors:**
  - Added `'use client'` directive to `CallToAction` component
  - Resolved Next.js `<Link>` component issues:
    - Removed deprecated `legacyBehavior` prop where appropriate in `NavBar` and `Footer`
    - Fixed hydration errors from nested `<a>` tags in `NavBar` by using `asChild` on `NavigationMenuLink`
  - Corrected client-side `signIn` import in `SignIn` component to use `next-auth/react`

## [0.1.1] - 2025-04-11

### Added

- Installed comprehensive AI package ecosystem:
  - **Mastra AI packages:**
    - @mastra/client-js (v0.1.16): Client-side SDK for Mastra integration
    - @mastra/core (v0.8.2): Core functionality for agent management
    - @mastra/loggers (v0.1.17): Logging utilities for Mastra agents
    - @mastra/memory (v0.2.9): Memory management for conversational agents
    - @mastra/pinecone (v0.2.7): Pinecone vector database integration
    - @mastra/upstash (v0.2.4): Upstash database integration
    - @mastra/vector-pinecone (v0.1.5): Vector operations with Pinecone
    - @mastra/voice-elevenlabs (v0.1.12): ElevenLabs voice integration
    - @mastra/voice-google (v0.1.12): Google voice integration
  - **@agentic ecosystem packages:**
    - @agentic/ai-sdk (v7.6.4): Core AI SDK functionality
    - @agentic/arxiv (v7.6.4): ArXiv research paper integration
    - @agentic/brave-search (v7.6.4): Brave search integration
    - @agentic/calculator (v7.6.4): Mathematical calculation capabilities
    - @agentic/core (v7.6.4): Core agent framework
    - @agentic/e2b (v7.6.4): E2B agent integration
    - @agentic/exa (v7.6.4): Exa search integration
    - @agentic/firecrawl (v7.6.4): Web crawling functionality
    - @agentic/genkit (v7.6.4): Generation toolkit
    - @agentic/google-custom-search (v7.6.4): Google Custom Search integration
    - @agentic/google-docs (v7.6.4): Google Docs integration
    - @agentic/google-drive (v7.6.4): Google Drive integration
    - @agentic/langchain (v7.6.4): LangChain integration
    - @agentic/llamaindex (v7.6.4): LlamaIndex integration
    - @agentic/mastra (v7.6.4): Mastra AI integration
    - @agentic/mcp (v7.6.4): Model Context Protocol integration
    - @agentic/stdlib (v7.6.4): Standard library for agent operations
    - @agentic/tavily (v7.6.4): Tavily search integration
    - @agentic/wikipedia (v7.6.4): Wikipedia integration
  - **AI SDK packages:**
    - @ai-sdk/google (v1.2.10): Google AI integration
    - @ai-sdk/google-vertex (v2.2.14): Google Vertex AI integration
    - @ai-sdk/provider (v1.1.2): Provider abstractions
    - @ai-sdk/provider-utils (v2.2.6): Utility functions for providers
  - **MCP integration:**
    - @modelcontextprotocol/sdk (v1.9.0): Model Context Protocol SDK
- Initialized Mastra with `pnpm dlx mastra@latest init`
- Added Mastra server packages to `serverExternalPackages` in Next.js config
- Created Weather API endpoint using Mastra agent
- Implemented server action `getWeatherInfo` for weather data
- Added Weather component with form for city input
- Set up API route for chat streaming with Mastra

### Changed

- Updated Next.js configuration to support Mastra integration
- Updated project version to 0.1.1

### Technical Details

- Configured `next.config.ts` to allow server-side external packages for Mastra
- Created a streaming API endpoint for chat responses
- Implemented server action for direct agent invocation
- Built React component with form data submission
- Integrated vector database capabilities through Pinecone (v5.1.1)
- Added support for LangChain (v0.3.21) and LangChain Community (v0.3.40)
- Set up integration with various AI providers through unified SDK interfaces
- Enabled voice capabilities through ElevenLabs and Google voice integrations

### Mastra Implementation Details

- **Core Setup (`/src/mastra/index.ts`):**
  - Configured Mastra instance with custom workflows, agents and logging
  - Centralized agent and workflow registration in a single export
- **Weather Agent (`/src/mastra/agents/index.ts`):**
  - Implemented a specialized weather assistant using Google's Gemini 1.5 Pro model
  - Defined detailed contextual instructions for consistent, accurate weather responses
  - Integrated with custom weather tool for real-time data retrieval
- **Custom Weather Tool (`/src/mastra/tools/index.ts`):**
  - Created a weather data retrieval tool using Open Meteo API
  - Implemented geocoding for location-to-coordinates conversion
  - Built comprehensive weather condition mapping for 30+ weather codes
  - Schema validation using Zod for type safety and input/output validation
- **Weather Workflow (`/src/mastra/workflows/index.ts`):**
  - Designed a multi-step workflow for advanced weather processing
  - Created an activity recommendation system based on weather conditions
  - Implemented structured output formatting with emojis and sectioned content

## [0.1.0] - 2025-04-11

### Initial Release

- Project scaffolding with Next.js 15.3.0
- Base configuration setup
