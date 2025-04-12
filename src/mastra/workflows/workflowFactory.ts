import { Mastra, Step, Workflow } from "@mastra/core";
import { z } from "zod";

const isMastra = (mastra: any): mastra is Mastra => {
  return mastra && typeof mastra === "object" && mastra instanceof Mastra;
};

// Step that creates and runs a dynamic workflow
const createDynamicWorkflow = new Step({
  id: "createDynamicWorkflow",
  outputSchema: z.object({
    dynamicWorkflowResult: z.any(),
  }),
  execute: async ({ context, mastra }) => {
    if (!mastra) {
      throw new Error("Mastra instance not available");
    }

    if (!isMastra(mastra)) {
      throw new Error("Invalid Mastra instance");
    }

    const inputData = context.triggerData.inputData;

    // Create a new dynamic workflow
    const dynamicWorkflow = new Workflow({
      name: "dynamic-workflow",
      mastra, // Pass the mastra instance to the new workflow
      triggerSchema: z.object({
        dynamicInput: z.string(),
      }),
    });

    // Define steps for the dynamic workflow
    const dynamicStep = new Step({
      id: "dynamicStep",
      execute: async ({ context }) => {
        const dynamicInput = context.triggerData.dynamicInput;
        return {
          processedValue: `Processed: ${dynamicInput}`,
        };
      },
    });

    // Build and commit the dynamic workflow
    dynamicWorkflow.step(dynamicStep).commit();

    // Create a run and execute the dynamic workflow
    const run = dynamicWorkflow.createRun();
    const result = await run.start({
      triggerData: {
        dynamicInput: inputData,
      },
    });

    let dynamicWorkflowResult;

    if (result.results["dynamicStep"]?.status === "success") {
      dynamicWorkflowResult =
        result.results["dynamicStep"]?.output.processedValue;
    } else {
      throw new Error("Dynamic workflow failed");
    }

    // Return the result from the dynamic workflow
    return {
      dynamicWorkflowResult,
    };
  },
});

// Main workflow that uses the dynamic workflow creator
const mainWorkflow = new Workflow({
  name: "main-workflow",
  triggerSchema: z.object({
    inputData: z.string(),
  }),
  mastra: new Mastra(),
});

mainWorkflow.step(createDynamicWorkflow).commit();

// Register the workflow with Mastra
export const mastra = new Mastra({
  workflows: { mainWorkflow },
});

const run = mainWorkflow.createRun();
const result = await run.start({
  triggerData: {
    inputData: "test",
  },
});
