import { createAIFunction, getEnv } from "@agentic/core";
import { createMastraTools } from "@agentic/mastra";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";

// --- Execute Code ---
const e2bExecuteCode = createAIFunction(
  {
    name: "e2b-execute-code",
    description: `
Execute code in a secure E2B sandbox (Python or TypeScript). Supports internet, filesystem, and package install. Returns result, stdout, stderr, display_data, and error.
- language: 'python' or 'typescript'
- code: code to execute
- Can install packages (pip/npm) and access files.
    `.trim(),
    inputSchema: z.object({
      code: z.string().describe("Code to execute in a single cell."),
      language: z.enum(["python", "typescript"]).default("python").describe("Programming language to use."),
      apiKey: z.string().optional().describe("Override E2B API key (optional)")
    }),
  },
  async ({ code, language, apiKey }) => {
    const sandbox = await Sandbox.create(language, { apiKey: apiKey || getEnv("E2B_API_KEY") });
    try {
      const exec = await sandbox.runCode(code, {
        onStderr: (output: any) => console.warn(`[E2B stderr][${language}]`, output?.message ?? output),
        onStdout: (output: any) => console.log(`[E2B stdout][${language}]`, output?.message ?? output),
      });
      if (exec.error) throw new Error(exec.error.value);
      return exec.results.map((result: any) => result.toJSON());
    } finally {
      await sandbox.kill();
    }
  }
);

const e2bReadFile = createAIFunction(
  {
    name: "e2b-read-file",
    description: "Read a file from the E2B sandbox filesystem.",
    inputSchema: z.object({
      path: z.string().describe("Path to the file to read."),
      language: z.enum(["python", "typescript"]).default("python").describe("Sandbox language context."),
      apiKey: z.string().optional().describe("Override E2B API key (optional)")
    }),
  },
  async ({ path, language, apiKey }) => {
    const sandbox = await Sandbox.create(language, { apiKey: apiKey || getEnv("E2B_API_KEY") });
    try {
      const content = await sandbox.files.read(path);
      return { path, content };
    } finally {
      await sandbox.kill();
    }
  }
);

const e2bWriteFile = createAIFunction(
  {
    name: "e2b-write-file",
    description: "Write content to a file in the E2B sandbox filesystem.",
    inputSchema: z.object({
      path: z.string().describe("Path to the file to write."),
      content: z.string().describe("Content to write to the file."),
      language: z.enum(["python", "typescript"]).default("python").describe("Sandbox language context."),
      apiKey: z.string().optional().describe("Override E2B API key (optional)")
    }),
  },
  async ({ path, content, language, apiKey }) => {
    const sandbox = await Sandbox.create(language, { apiKey: apiKey || getEnv("E2B_API_KEY") });
    try {
      await sandbox.files.write(path, content);
      return { path, success: true };
    } finally {
      await sandbox.kill();
    }
  }
);

const e2bInstallPackage = createAIFunction(
  {
    name: "e2b-install-package",
    description: "Install a package in the E2B sandbox (pip for Python, npm for TypeScript).",
    inputSchema: z.object({
      package: z.string().describe("Name of the package to install."),
      language: z.enum(["python", "typescript"]).default("python").describe("Sandbox language context."),
      apiKey: z.string().optional().describe("Override E2B API key (optional)")
    }),
  },
  async ({ package: pkg, language, apiKey }) => {
    const sandbox = await Sandbox.create(language, { apiKey: apiKey || getEnv("E2B_API_KEY") });
    try {
      if (language === "python") {
        await sandbox.runCode(`!pip install ${pkg}`);
      } else {
        await sandbox.runCode(`!npm install ${pkg}`);
      }
      return { package: pkg, success: true };
    } finally {
      await sandbox.kill();
    }
  }
);

const e2bListFiles = createAIFunction(
  {
    name: "e2b-list-files",
    description: "List files in a directory in the E2B sandbox filesystem.",
    inputSchema: z.object({
      path: z.string().default(".").describe("Directory path to list."),
      language: z.enum(["python", "typescript"]).default("python").describe("Sandbox language context."),
      apiKey: z.string().optional().describe("Override E2B API key (optional)")
    }),
  },
  async ({ path, language, apiKey }) => {
    const sandbox = await Sandbox.create(language, { apiKey: apiKey || getEnv("E2B_API_KEY") });
    try {
      const files = await sandbox.files.list(path);
      return { path, files };
    } finally {
      await sandbox.kill();
    }
  }
);

export function createMastraE2BTools(config: { apiKey?: string } = {}) {
  return createMastraTools(
    e2bExecuteCode,
    e2bReadFile,
    e2bWriteFile,
    e2bInstallPackage,
    e2bListFiles
  );
}

export { e2bExecuteCode, e2bReadFile, e2bWriteFile, e2bInstallPackage, e2bListFiles };
