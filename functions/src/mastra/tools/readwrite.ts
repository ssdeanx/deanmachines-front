/**
 * File Reading and Writing Tools for Mastra AI.
 *
 * This module provides tools for reading from and writing to files in the filesystem
 * with support for different file formats, encodings, and write modes.
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fs from "fs-extra";
import { resolve, dirname, extname, join } from "path";
import { createLangSmithRun, trackFeedback } from "../services/langsmith";

/**
 * Supported file encoding types
 */
export enum FileEncoding {
  /** UTF-8 text encoding */
  UTF8 = "utf8",
  /** ASCII text encoding */
  ASCII = "ascii",
  /** UTF-16 Little Endian encoding */
  UTF16LE = "utf16le",
  /** Latin1 encoding */
  LATIN1 = "latin1",
  /** Base64 encoding */
  BASE64 = "base64",
  /** Hex encoding */
  HEX = "hex",
}

/**
 * File write modes
 */
export enum FileWriteMode {
  /** Overwrite the file if it exists */
  OVERWRITE = "overwrite",
  /** Append to the file if it exists */
  APPEND = "append",
  /** Create a new file, fail if the file exists */
  CREATE_NEW = "create-new",
}

/**
 * Base path for knowledge folder
 */
const KNOWLEDGE_BASE_PATH = resolve(process.cwd(), "src", "mastra", "knowledge");

/**
 * Validates if a path is within the knowledge folder
 */
function isKnowledgePath(path: string): boolean {
  const absolutePath = resolve(path);
  return absolutePath.startsWith(KNOWLEDGE_BASE_PATH);
}

/**
 * Resolves a knowledge folder path
 */
function resolveKnowledgePath(path: string): string {
  return join(KNOWLEDGE_BASE_PATH, path);
}

/**
 * Tool for reading files from the filesystem
 */
export const readFileTool = createTool({
  id: "read-file",
  description:
    "Reads a file from the filesystem with support for various formats and encodings",
  inputSchema: z.object({
    path: z
      .string()
      .describe("Path to the file to read (absolute or relative)"),
    encoding: z
      .enum([
        FileEncoding.UTF8,
        FileEncoding.ASCII,
        FileEncoding.UTF16LE,
        FileEncoding.LATIN1,
        FileEncoding.BASE64,
        FileEncoding.HEX,
      ])
      .default(FileEncoding.UTF8)
      .describe("Encoding to use when reading the file"),
    maxSizeBytes: z
      .number()
      .optional()
      .default(10485760)
      .describe("Maximum file size in bytes (default: 10MB)"),
    startLine: z
      .number()
      .optional()
      .default(0)
      .describe("Line to start reading from (0-indexed)"),
    endLine: z
      .number()
      .optional()
      .describe("Line to end reading at (0-indexed, inclusive)"),
  }),
  outputSchema: z.object({
    content: z.string().describe("Content of the file"),
    metadata: z.object({
      path: z.string().describe("Absolute path to the file"),
      size: z.number().describe("Size of the file in bytes"),
      extension: z.string().describe("File extension"),
      encoding: z.string().describe("Encoding used to read the file"),
      lineCount: z.number().describe("Total number of lines in the file"),
      readLines: z.number().describe("Number of lines read"),
    }),
    success: z.boolean().describe("Whether the operation was successful"),
    error: z
      .string()
      .optional()
      .describe("Error message if the operation failed"),
  }),
  execute: async ({ context }) => {
    const runId = await createLangSmithRun("read-file", ["file", "read"]);

    try {
      // Resolve the absolute path
      const absolutePath = resolve(context.path);

      // Check if the file exists
      try {
        await fs.access(absolutePath);
      } catch (error) {
        await trackFeedback(runId, {
          score: 0,
          comment: `File does not exist: ${absolutePath}`,
          key: "file_read_failure",
        });

        return {
          content: "",
          metadata: {
            path: absolutePath,
            size: 0,
            extension: extname(absolutePath),
            encoding: context.encoding,
            lineCount: 0,
            readLines: 0,
          },
          success: false,
          error: `File does not exist: ${absolutePath}`,
        };
      }

      // Get file stats
      const stats = await fs.stat(absolutePath);

      // Check file size
      if (stats.size > context.maxSizeBytes) {
        await trackFeedback(runId, {
          score: 0,
          comment: `File too large: ${stats.size} bytes (max: ${context.maxSizeBytes} bytes)`,
          key: "file_read_failure",
        });

        return {
          content: "",
          metadata: {
            path: absolutePath,
            size: stats.size,
            extension: extname(absolutePath),
            encoding: context.encoding,
            lineCount: 0,
            readLines: 0,
          },
          success: false,
          error: `File too large: ${stats.size} bytes (max: ${context.maxSizeBytes} bytes)`,
        };
      }

      // Read the file
      const content = await fs.readFile(absolutePath, context.encoding);

      // Handle line-based reading if requested
      let processedContent = content;
      const allLines = content.split(/\r?\n/);
      let readLines = allLines.length;

      if (context.startLine > 0 || context.endLine !== undefined) {
        const startLine = Math.max(0, context.startLine);
        const endLine =
          context.endLine !== undefined
            ? Math.min(context.endLine, allLines.length - 1)
            : allLines.length - 1;

        if (startLine > endLine) {
          await trackFeedback(runId, {
            score: 0.5,
            comment: `Invalid line range: start (${startLine}) > end (${endLine})`,
            key: "file_read_warning",
          });

          return {
            content: "",
            metadata: {
              path: absolutePath,
              size: stats.size,
              extension: extname(absolutePath),
              encoding: context.encoding,
              lineCount: allLines.length,
              readLines: 0,
            },
            success: false,
            error: `Invalid line range: start (${startLine}) > end (${endLine})`,
          };
        }

        // Extract the requested lines
        processedContent = allLines.slice(startLine, endLine + 1).join("\n");
        readLines = endLine - startLine + 1;
      }

      // Track success in LangSmith
      await trackFeedback(runId, {
        score: 1,
        comment: `Successfully read file: ${absolutePath} (${stats.size} bytes)`,
        key: "file_read_success",
        value: {
          path: absolutePath,
          size: stats.size,
          lineCount: allLines.length,
          readLines,
        },
      });

      return {
        content: processedContent,
        metadata: {
          path: absolutePath,
          size: stats.size,
          extension: extname(absolutePath),
          encoding: context.encoding,
          lineCount: allLines.length,
          readLines,
        },
        success: true,
      };
    } catch (error) {
      console.error("Error reading file:", error);

      // Track failure in LangSmith
      await trackFeedback(runId, {
        score: 0,
        comment: error instanceof Error ? error.message : "Unknown error",
        key: "file_read_failure",
      });

      return {
        content: "",
        metadata: {
          path: context.path,
          size: 0,
          extension: extname(context.path),
          encoding: context.encoding,
          lineCount: 0,
          readLines: 0,
        },
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error reading file",
      };
    }
  },
});

/**
 * TOOL NAME UPDATE: Changed export id from "write-to-file" to "write-file"
 * to match the research-agent's requirement.
 */

/**
 * Tool for writing content to files in the filesystem
 */
export const writeToFileTool = createTool({
  id: "write-file",
  description:
    "Writes content to a file in the filesystem with support for various modes and encodings",
  inputSchema: z.object({
    path: z
      .string()
      .describe("Path to the file to write (absolute or relative)"),
    content: z.string().describe("Content to write to the file"),
    mode: z
      .enum([FileWriteMode.OVERWRITE, FileWriteMode.APPEND, FileWriteMode.CREATE_NEW])
      .default(FileWriteMode.OVERWRITE)
      .describe("Write mode"),
    encoding: z
      .enum([FileEncoding.UTF8, FileEncoding.ASCII, FileEncoding.UTF16LE, FileEncoding.LATIN1, FileEncoding.BASE64, FileEncoding.HEX])
      .default(FileEncoding.UTF8)
      .describe("Encoding to use when writing the file"),
    createDirectory: z
      .boolean()
      .optional()
      .default(false)
      .describe("Create parent directories if they don't exist"),
    maxSizeBytes: z
      .number()
      .optional()
      .default(10485760)
      .describe("Maximum content size in bytes (default: 10MB)"),
  }),
  outputSchema: z.object({
    metadata: z.object({
      path: z.string().describe("Absolute path to the file"),
      size: z.number().describe("Size of the written content in bytes"),
      extension: z.string().describe("File extension"),
      encoding: z.string().describe("Encoding used to write the file"),
      mode: z.string().describe("Write mode used"),
    }),
    success: z.boolean().describe("Whether the operation was successful"),
    error: z.string().optional().describe("Error message if the operation failed"),
  }),
  execute: async ({ context }) => {
    const runId = await createLangSmithRun("write-file", ["file", "write"]);

    try {
      // Resolve the absolute path
      const absolutePath = resolve(context.path);

      // Check content size
      const contentSize = Buffer.byteLength(context.content, context.encoding);
      if (contentSize > context.maxSizeBytes) {
        await trackFeedback(runId, {
          score: 0,
          comment: `Content too large: ${contentSize} bytes (max: ${context.maxSizeBytes} bytes)`,
          key: "file_write_failure",
        });

        return {
          metadata: {
            path: absolutePath,
            size: contentSize,
            extension: extname(absolutePath),
            encoding: context.encoding,
            mode: context.mode,
          },
          success: false,
          error: `Content too large: ${contentSize} bytes (max: ${context.maxSizeBytes} bytes)`,
        };
      }

      // Create parent directories if requested
      if (context.createDirectory) {
        await fs.ensureDir(dirname(absolutePath));
      }

      // Check if the file exists
      let fileExists = false;
      try {
        await fs.access(absolutePath);
        fileExists = true;
      } catch (error) {
        // File doesn't exist
      }

      // Handle write mode
      if (fileExists && context.mode === FileWriteMode.CREATE_NEW) {
        await trackFeedback(runId, {
          score: 0,
          comment: `File already exists and mode is ${FileWriteMode.CREATE_NEW}`,
          key: "file_write_failure",
        });

        return {
          metadata: {
            path: absolutePath,
            size: 0,
            extension: extname(absolutePath),
            encoding: context.encoding,
            mode: context.mode,
          },
          success: false,
          error: `File already exists and mode is ${FileWriteMode.CREATE_NEW}`,
        };
      }

      // Write or append to the file based on the mode
      if (context.mode === FileWriteMode.APPEND && fileExists) {
        await fs.appendFile(absolutePath, context.content, context.encoding);
      } else {
        await fs.writeFile(absolutePath, context.content, context.encoding);
      }

      // Track success in LangSmith
      await trackFeedback(runId, {
        score: 1,
        comment: `Successfully wrote to file: ${absolutePath} (${contentSize} bytes)`,
        key: "file_write_success",
        value: { path: absolutePath, size: contentSize, mode: context.mode },
      });

      return {
        metadata: {
          path: absolutePath,
          size: contentSize,
          extension: extname(absolutePath),
          encoding: context.encoding,
          mode: context.mode,
        },
        success: true,
      };
    } catch (error) {
      console.error("Error writing to file:", error);

      // Track failure in LangSmith
      await trackFeedback(runId, {
        score: 0,
        comment: error instanceof Error ? error.message : "Unknown error",
        key: "file_write_failure",
      });

      return {
        metadata: {
          path: context.path,
          size: 0,
          extension: extname(context.path),
          encoding: context.encoding,
          mode: context.mode,
        },
        success: false,
        error: error instanceof Error ? error.message : "Unknown error writing to file",
      };
    }
  },
});

export const readKnowledgeFileTool = createTool({
  id: "read-knowledge-file",
  description: "Reads a file from the knowledge folder",
  inputSchema: z.object({
    path: z.string().describe("Path relative to knowledge folder"),
    encoding: z
      .enum([
        FileEncoding.UTF8,
        FileEncoding.ASCII,
        FileEncoding.UTF16LE,
        FileEncoding.LATIN1,
        FileEncoding.BASE64,
        FileEncoding.HEX,
      ])
      .default(FileEncoding.UTF8),
    maxSizeBytes: z.number().optional().default(10485760),
  }),
  outputSchema: z.object({
    content: z.string().describe("Content of the file"),
    metadata: z.object({
      path: z.string().describe("Absolute path to the file"),
      size: z.number().describe("Size of the file in bytes"),
      extension: z.string().describe("File extension"),
      encoding: z.string().describe("Encoding used to read the file"),
      lineCount: z.number().describe("Total number of lines in the file"),
      readLines: z.number().describe("Number of lines read"),
    }),
    success: z.boolean().describe("Whether the operation was successful"),
    error: z
      .string()
      .optional()
      .describe("Error message if the operation failed"),
  }),
  execute: async ({ context }) => {
    const runId = await createLangSmithRun("read-knowledge-file", [
      "knowledge",
      "read",
    ]);

    try {
      const knowledgePath = resolveKnowledgePath(context.path);

      if (!isKnowledgePath(knowledgePath)) {
        throw new Error("Access denied: Can only read from knowledge folder");
      }

      // Ensure the execute method exists before calling it
      if (!readFileTool.execute) {
        throw new Error("readFileTool.execute is not defined");
      }

      // Modify context to use knowledge path and provide default startLine
      return readFileTool.execute({
        context: { ...context, path: knowledgePath, startLine: 0 },
      });
    } catch (error) {
      console.error("Error reading knowledge file:", error);

      // Track failure in LangSmith
      await trackFeedback(runId, {
        score: 0,
        comment: error instanceof Error ? error.message : "Unknown error",
        key: "knowledge_read_failure",
      });

      return {
        content: "",
        metadata: {
          path: context.path,
          size: 0,
          extension: extname(context.path),
          encoding: context.encoding,
          lineCount: 0,
          readLines: 0,
        },
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error reading knowledge file",
      };
    }
  },
});

export const writeKnowledgeFileTool = createTool({
  id: "write-knowledge-file",
  description: "Writes content to a file in the knowledge folder",
  inputSchema: z.object({
    path: z.string().describe("Path relative to knowledge folder"),
    content: z.string(),
    mode: z
      .enum([
        FileWriteMode.OVERWRITE,
        FileWriteMode.APPEND,
        FileWriteMode.CREATE_NEW,
      ])
      .default(FileWriteMode.OVERWRITE),
    encoding: z
      .enum([
        FileEncoding.UTF8,
        FileEncoding.ASCII,
        FileEncoding.UTF16LE,
        FileEncoding.LATIN1,
        FileEncoding.BASE64,
        FileEncoding.HEX,
      ])
      .default(FileEncoding.UTF8),
    createDirectory: z.boolean().optional().default(true),
  }),
  outputSchema: z.object({
    metadata: z.object({
      path: z.string().describe("Absolute path to the file"),
      size: z.number().describe("Size of the written content in bytes"),
      extension: z.string().describe("File extension"),
      encoding: z.string().describe("Encoding used to write the file"),
      mode: z.string().describe("Write mode used"),
    }),
    success: z.boolean().describe("Whether the operation was successful"),
    error: z
      .string()
      .optional()
      .describe("Error message if the operation failed"),
  }),
  execute: async ({ context }) => {
    const runId = await createLangSmithRun("write-knowledge-file", [
      "knowledge",
      "write",
    ]);

    try {
      const knowledgePath = resolveKnowledgePath(context.path);

      if (!isKnowledgePath(knowledgePath)) {
        throw new Error("Access denied: Can only write to knowledge folder");
      }

      // Ensure the execute method exists before calling it
      if (!writeToFileTool.execute) {
        throw new Error("writeToFileTool.execute is not defined");
      }

      // Modify context to use knowledge path and include default maxSizeBytes
      return writeToFileTool.execute({
        context: {
          ...context,
          path: knowledgePath,
          // Provide the default value from writeToFileTool's schema
          maxSizeBytes: 10485760,
        },
      });
    } catch (error) {
      console.error("Error writing to knowledge file:", error);

      // Track failure in LangSmith
      await trackFeedback(runId, {
        score: 0,
        comment: error instanceof Error ? error.message : "Unknown error",
        key: "knowledge_write_failure",
      });

      return {
        metadata: {
          path: context.path,
          size: 0,
          extension: extname(context.path),
          encoding: context.encoding,
          mode: context.mode,
        },
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error writing knowledge file",
      };
    }
  },
});

// CREATE FILE TOOL
export const createFileTool = createTool({
  id: "create-file",
  description: "Creates a new file. Fails if the file already exists.",
  inputSchema: z.object({
    path: z.string().describe("Path to the file to create (absolute or relative)"),
    content: z.string().describe("Content to write to the new file"),
    encoding: z.enum([
      FileEncoding.UTF8,
      FileEncoding.ASCII,
      FileEncoding.UTF16LE,
      FileEncoding.LATIN1,
      FileEncoding.BASE64,
      FileEncoding.HEX,
    ]).default(FileEncoding.UTF8),
    createDirectory: z.boolean().optional().default(false),
  }),
  outputSchema: z.object({
    metadata: z.object({
      path: z.string(),
      size: z.number(),
      extension: z.string(),
      encoding: z.string(),
    }),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const absolutePath = resolve(context.path);
    try {
      // Check if file exists
      await fs.access(absolutePath);
      return {
        metadata: {
          path: absolutePath,
          size: 0,
          extension: extname(absolutePath),
          encoding: context.encoding,
        },
        success: false,
        error: "File already exists.",
      };
    } catch {
      // File does not exist, proceed
    }
    if (context.createDirectory) {
      await fs.ensureDir(dirname(absolutePath));
    }
    await fs.writeFile(absolutePath, context.content, context.encoding);
    return {
      metadata: {
        path: absolutePath,
        size: Buffer.byteLength(context.content, context.encoding),
        extension: extname(absolutePath),
        encoding: context.encoding,
      },
      success: true,
    };
  },
});

// EDIT FILE TOOL (simple search/replace)
export const editFileTool = createTool({
  id: "edit-file",
  description: "Edits a file by searching and replacing text.",
  inputSchema: z.object({
    path: z.string().describe("Path to the file to edit (absolute or relative)"),
    search: z.string().describe("Text or regex to search for"),
    replace: z.string().describe("Replacement text"),
    encoding: z.enum([
      FileEncoding.UTF8,
      FileEncoding.ASCII,
      FileEncoding.UTF16LE,
      FileEncoding.LATIN1,
      FileEncoding.BASE64,
      FileEncoding.HEX,
    ]).default(FileEncoding.UTF8),
    isRegex: z.boolean().optional().default(false),
  }),
  outputSchema: z.object({
    metadata: z.object({
      path: z.string(),
      size: z.number(),
      extension: z.string(),
      encoding: z.string(),
      edits: z.number(),
    }),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const absolutePath = resolve(context.path);
    try {
      let content = await fs.readFile(absolutePath, context.encoding);
      let edits = 0;
      let newContent;
      if (context.isRegex) {
        const regex = new RegExp(context.search, "g");
        newContent = content.replace(regex, (match) => {
          edits++;
          return context.replace;
        });
      } else {
        newContent = content.split(context.search).join(context.replace);
        edits = (content.match(new RegExp(context.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g")) || []).length;
      }
      await fs.writeFile(absolutePath, newContent, context.encoding);
      return {
        metadata: {
          path: absolutePath,
          size: Buffer.byteLength(newContent, context.encoding),
          extension: extname(absolutePath),
          encoding: context.encoding,
          edits,
        },
        success: true,
      };
    } catch (error) {
      return {
        metadata: {
          path: absolutePath,
          size: 0,
          extension: extname(absolutePath),
          encoding: context.encoding,
          edits: 0,
        },
        success: false,
        error: error instanceof Error ? error.message : "Unknown error editing file",
      };
    }
  },
});

// DELETE FILE TOOL
export const deleteFileTool = createTool({
  id: "delete-file",
  description: "Deletes a file at the given path.",
  inputSchema: z.object({
    path: z.string().describe("Path to the file to delete (absolute or relative)"),
  }),
  outputSchema: z.object({
    path: z.string(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const absolutePath = resolve(context.path);
    try {
      await fs.remove(absolutePath);
      return { path: absolutePath, success: true };
    } catch (error) {
      return {
        path: absolutePath,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error deleting file",
      };
    }
  },
});

// LIST FILES TOOL
export const listFilesTool = createTool({
  id: "list-files",
  description: "Lists files and folders in a directory.",
  inputSchema: z.object({
    path: z.string().describe("Directory path (absolute or relative)"),
    filterExtension: z.string().optional().describe("Filter by file extension (e.g. .ts)"),
    recursive: z.boolean().optional().default(false),
  }),
  outputSchema: z.object({
    files: z.array(z.object({
      name: z.string(),
      path: z.string(),
      isDirectory: z.boolean(),
      extension: z.string(),
    })),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const absolutePath = resolve(context.path);
    const results: Array<{ name: string; path: string; isDirectory: boolean; extension: string }> = [];
    async function walk(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push({
            name: entry.name,
            path: entryPath,
            isDirectory: true,
            extension: "",
          });
          if (context.recursive) await walk(entryPath);
        } else {
          if (!context.filterExtension || entry.name.endsWith(context.filterExtension)) {
            results.push({
              name: entry.name,
              path: entryPath,
              isDirectory: false,
              extension: extname(entry.name),
            });
          }
        }
      }
    }
    try {
      await walk(absolutePath);
      return { files: results, success: true };
    } catch (error) {
      return {
        files: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error listing files",
      };
    }
  },
});

// Original tools are already exported when defined
