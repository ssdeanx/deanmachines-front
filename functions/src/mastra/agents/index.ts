import { researchAgent } from "./research.agent";
import { analystAgent } from "./analyst.agent";
import { writerAgent } from "./writer.agent";
import { rlTrainerAgent } from "./rlTrainer.agent";
import { dataManagerAgent } from "./dataManager.agent";
import { agenticAssistant } from "./agentic.agent";
import { coderAgent } from "./coder.agent";
import { copywriterAgent } from "./copywriter.agent";
import { architectAgent } from "./architect.agent";
import { debuggerAgent } from "./debugger.agent";
import { uiUxCoderAgent } from "./uiUxCoder.agent";
import { codeDocumenterAgent } from "./codeDocumenter.agent";
import { marketResearchAgent } from "./marketResearch.agent";
import { socialMediaAgent } from "./socialMedia.agent";
import { seoAgent } from "./seoAgent.agent";

// Export each agent by name for direct named imports
export {
  researchAgent,
  analystAgent,
  writerAgent,
  rlTrainerAgent,
  dataManagerAgent,
  agenticAssistant,
  coderAgent,
  copywriterAgent,
  architectAgent,
  debuggerAgent,
  uiUxCoderAgent,
  codeDocumenterAgent,
  marketResearchAgent,
  socialMediaAgent,
  seoAgent,
};

// Also export as a grouped object for object-style imports
export const agents = {
  researchAgent,
  analystAgent,
  writerAgent,
  rlTrainerAgent,
  dataManagerAgent,
  agenticAssistant,
  coderAgent,
  copywriterAgent,
  architectAgent,
  debuggerAgent,
  uiUxCoderAgent,
  codeDocumenterAgent,
  marketResearchAgent,
  socialMediaAgent,
  seoAgent,
};

export default agents;