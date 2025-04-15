import { Mastra, Step, Workflow } from "@mastra/core";
import type { Mastra as MastraType } from "@mastra/core";
import { z } from "zod";
import { createAISpan, recordMetrics } from "../services/signoz";

const dynamicInputSchema = z.object({
  dynamicInput: z.string(),
});
const dynamicOutputSchema = z.object({
  processedValue: z.string(),
});

export function createDynamicWorkflowFactory(mastra: MastraType) {
  return new Workflow({
    name: "dynamic-workflow",
    mastra,
    triggerSchema: dynamicInputSchema,
  })
    .step(
      new Step({
        id: "dynamicStep",
        outputSchema: dynamicOutputSchema,
        execute: async ({ context }) => {
          const span = createAISpan("dynamicStep.execute");
          try {
            const dynamicInput = context.triggerData.dynamicInput;
            const processedValue = `Processed: ${dynamicInput}`;
            recordMetrics(span, { status: "success" });
            return { processedValue };
          } catch (error) {
            recordMetrics(span, { status: "error", errorMessage: String(error) });
            throw error;
          } finally {
            span.end();
          }
        },
      })
    )
    .commit();
}

export const createDynamicWorkflowStep = new Step({
  id: "createDynamicWorkflow",
  outputSchema: z.object({
    dynamicWorkflowResult: dynamicOutputSchema,
  }),
  execute: async ({ context, mastra }) => {
    const mastraInstance = mastra as MastraType;
    if (!mastraInstance) throw new Error("Mastra instance not available");
    const inputData = context.triggerData.inputData;
    const span = createAISpan("createDynamicWorkflowStep.execute");
    try {
      const dynamicWorkflow = createDynamicWorkflowFactory(mastraInstance);
      const run = dynamicWorkflow.createRun();
      const result = await run.start({
        triggerData: { dynamicInput: inputData },
      });
      if (result.results["dynamicStep"]?.status === "success") {
        recordMetrics(span, { status: "success" });
        return {
          dynamicWorkflowResult: result.results["dynamicStep"].output,
        };
      } else {
        recordMetrics(span, { status: "error", errorMessage: "Dynamic workflow failed" });
        throw new Error("Dynamic workflow failed");
      }
    } catch (error) {
      recordMetrics(span, { status: "error", errorMessage: String(error) });
      throw error;
    } finally {
      span.end();
    }
  },
});

export const mainWorkflow = new Workflow({
  name: "main-workflow",
  triggerSchema: z.object({
    inputData: z.string(),
  }),
  mastra: new Mastra(),
})
  .step(createDynamicWorkflowStep)
  .commit();

export const mastra = new Mastra({
  workflows: { mainWorkflow },
});

export async function runMainWorkflow(inputData: string) {
  const run = mainWorkflow.createRun();
  return await run.start({ triggerData: { inputData } });
}
