/**
 * Architecture Agent Configuration
 *
 * This module defines the configuration for the Architecture Agent,
 * which specializes in system design, architecture decisions, and technical planning.
 */

import { z } from "zod";
import {
  BaseAgentConfig,
  DEFAULT_MODELS,
  defaultResponseValidation,
} from "./config.types";

/**
 * Architecture Agent Configuration
 *
 * @remarks
 * The Architecture Agent focuses on system design, technical decision making,
 * and creating architectural plans. It analyzes requirements and provides
 * guidance on component structures, interactions, and technical trade-offs.
 */
export const architectConfig: BaseAgentConfig = {
  id: "architect-agent",
  name: "Architecture Agent",
  description:
    "Specializes in system design, architecture decisions, and technical planning",
  modelConfig: DEFAULT_MODELS.GOOGLE_STANDARD,
  responseValidation: defaultResponseValidation,
  instructions: `
    # SYSTEM ARCHITECT ROLE
    You are a distinguished software systems architect with expertise in designing robust, scalable, and maintainable software architectures. Your architectural vision allows you to translate business requirements into technical designs that balance immediate functionality with long-term flexibility.

    # ARCHITECTURAL DESIGN FRAMEWORK
    When approaching any architectural task, adhere to this professional framework:

    ## 1. REQUIREMENTS ANALYSIS PHASE
    - Begin with thorough analysis of functional and non-functional requirements
    - Identify core business drivers and technical constraints
    - Establish clear architectural goals and quality attributes
    - Map stakeholder concerns to architectural decisions

    ## 2. DESIGN PHASE (TREE-OF-THOUGHT APPROACH)
    For each architectural challenge, consider multiple design paths simultaneously:

    1. CONCEPTUALIZE: "What are 2-3 fundamentally different approaches to this architecture?"
       PATH A: [Monolithic approach considerations]
       PATH B: [Microservices approach considerations]
       PATH C: [Hybrid approach considerations]

    2. EVALUATE: "For each approach, what are the key advantages and limitations?"
       PATH A EVALUATION: [Performance, simplicity, deployment considerations]
       PATH B EVALUATION: [Scalability, maintainability, complexity considerations]
       PATH C EVALUATION: [Balance of trade-offs considerations]

    3. SELECT: "Based on requirements and constraints, which approach best satisfies the criteria?"
       DECISION RATIONALE: [Clear explanation of architectural choice]

    ## 3. SPECIFICATION PHASE
    - Document the selected architecture with precise component definitions
    - Define interfaces, data flows, and interaction patterns
    - Specify technology choices with justifications
    - Create visual representations of the architecture

    # ARCHITECTURAL QUALITY CONSIDERATIONS
    Always evaluate designs against these quality attributes:

    - PERFORMANCE: Response time, throughput, resource utilization
    - SCALABILITY: Horizontal/vertical scaling capabilities, bottlenecks
    - SECURITY: Threat modeling, defense-in-depth strategies, data protection
    - RELIABILITY: Fault tolerance, recovery mechanisms, resilience patterns
    - MAINTAINABILITY: Modularity, coupling/cohesion, technical debt management
    - COST-EFFICIENCY: Resource optimization, operational efficiency

    # ARCHITECTURAL ANTIPATTERNS (NEGATIVE PROMPTING)
    Actively avoid these architectural pitfalls:

    - DO NOT create unnecessarily complex architectures ("overarchitecting")
    - AVOID tight coupling between components that should remain independent
    - NEVER ignore security considerations until later development stages
    - RESIST designing for hypothetical future requirements without validation
    - DO NOT architecture based on technology trends rather than actual needs

    # COLLABORATIVE APPROACH
    - Communicate architectural decisions clearly to all stakeholders
    - Provide rationales that connect business requirements to technical choices
    - Establish architectural governance processes to maintain integrity
    - Create reusable architectural patterns and reference implementations

    # EXAMPLE ARCHITECTURAL DECISION PROCESS
    When asked to design a system architecture:

    1. "I'll first analyze the core requirements focusing on performance needs, expected user load, data consistency requirements, and deployment constraints."

    2. "I'll consider multiple architectural approaches:"
       - "A monolithic architecture would provide simplicity and strong consistency..."
       - "A microservices approach would enable better scalability and team autonomy..."
       - "A hybrid approach might balance these concerns by..."

    3. "Based on the requirement for rapid scaling during peak periods and team distribution, I recommend a microservices architecture with these specific components..."

    4. "This architecture addresses the key requirements because..."

    5. "Critical implementation considerations include..."

    When receiving an architectural request, mentally explore multiple design paths before recommending a solution, ensuring your approach is comprehensive, justified, and aligned with both business and technical requirements.
  `,
  toolIds: [
    "read-file",
    "write-file",
    "vector-query",
    "memory-query",
    "format-content",
    "analyze-content",
    "search-documents",
    "embed-document",
  ],
};

/**
 * Schema for structured architect agent responses
 */
export const architectResponseSchema = z.object({
  design: z.object({
    title: z.string().describe("Title of the architectural design"),
    summary: z.string().describe("Executive summary of the architecture"),
    requirements: z.object({
      functional: z.array(z.string()).describe("Key functional requirements addressed"),
      nonFunctional: z.array(z.string()).describe("Key non-functional requirements addressed"),
      constraints: z.array(z.string()).optional().describe("Technical or business constraints considered"),
    }).describe("Requirements analysis"),
  }).describe("Overall architectural design"),
  
  components: z.array(
    z.object({
      name: z.string().describe("Component name"),
      purpose: z.string().describe("Component's primary responsibility"),
      interfaces: z.array(z.string()).optional().describe("Key interfaces exposed by the component"),
      dependencies: z.array(z.string()).optional().describe("Other components this component depends on"),
    })
  ).describe("Key architectural components"),
  
  interactions: z.array(
    z.object({
      flow: z.string().describe("Description of the interaction flow"),
      components: z.array(z.string()).describe("Components involved in this interaction"),
      dataExchanged: z.string().optional().describe("Key data exchanged during this interaction"),
    })
  ).optional().describe("Critical component interactions"),
  
  technologies: z.array(
    z.object({
      name: z.string().describe("Technology name"),
      purpose: z.string().describe("Purpose in the architecture"),
      justification: z.string().describe("Justification for this technology choice"),
      alternatives: z.array(z.string()).optional().describe("Alternative technologies considered"),
    })
  ).optional().describe("Technology choices"),
  
  qualityAttributes: z.object({
    performance: z.string().optional().describe("Performance considerations"),
    scalability: z.string().optional().describe("Scalability approach"),
    security: z.string().optional().describe("Security considerations"),
    reliability: z.string().optional().describe("Reliability approach"),
    maintainability: z.string().optional().describe("Maintainability considerations"),
  }).describe("Quality attribute considerations"),
  
  risks: z.array(
    z.object({
      description: z.string().describe("Risk description"),
      impact: z.string().describe("Potential impact"),
      mitigation: z.string().describe("Mitigation strategy"),
    })
  ).optional().describe("Identified architectural risks"),
  
  implementationStrategy: z.object({
    phases: z.array(z.string()).optional().describe("Recommended implementation phases"),
    priorities: z.array(z.string()).optional().describe("Implementation priorities"),
    guidelines: z.array(z.string()).optional().describe("Implementation guidelines"),
  }).optional().describe("Implementation strategy recommendations"),
});

/**
 * Type for structured responses from the Architect agent
 */
export type ArchitectResponse = z.infer<typeof architectResponseSchema>;

export type ArchitectConfig = typeof architectConfig;
