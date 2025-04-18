import type * as google from 'googleapis'
import type { SetNonNullable, Simplify } from 'type-fest'
import {
  aiFunction,
  AIFunctionsProvider,
  pruneNullOrUndefinedDeep,
  type SetRequired
} from '@agentic/core'
import { z } from 'zod'
import { createMastraTools } from '@agentic/mastra';

export namespace googleDocs {
  export type Document = Simplify<
    SetNonNullable<google.docs_v1.Schema$Document>
  >
}

/**
 * Output schema for Google Docs document
 */
export const GoogleDocsDocumentSchema = z.object({
  documentId: z.string(),
  title: z.string().optional(),
  body: z.any().optional(),
  // Add more fields as needed for your use case
}).passthrough();

/**
 * Helper to create Mastra-compatible Google Docs tools with outputSchema patched
 */
export function createMastraGoogleDocsTools(client: GoogleDocsClient) {
  const mastraTools = createMastraTools(client);
  if (mastraTools.google_docs_get_document) {
    (mastraTools.google_docs_get_document as any).outputSchema = GoogleDocsDocumentSchema;
  }
  return mastraTools;
}

/**
 * Simplified Google Docs API client.
 *
 * @see https://developers.google.com/workspace/drive/api
 *
 * @example
 * ```ts
 * import { GoogleDocsClient } from '@agentic/google-docs'
 * import { authenticate } from '@google-cloud/local-auth'
 * import { google } from 'googleapis'
 *
 * // (in a real app, store these auth credentials and reuse them)
 * const auth = await authenticate({
 *   scopes: ['https://www.googleapis.com/auth/documents.readonly'],
 *   keyfilePath: process.env.GOOGLE_CREDENTIALS_PATH
 * })
 * const docs = google.docs({ version: 'v1', auth })
 * const client = new GoogleDocsClient({ docs })
 * ```
 */
export class GoogleDocsClient extends AIFunctionsProvider {
  protected readonly docs: google.docs_v1.Docs

  constructor({ docs }: { docs: google.docs_v1.Docs }) {
    super()

    this.docs = docs
  }

  /**
   * Gets a Google Docs document by ID.
   */
  @aiFunction({
    name: 'google_docs_get_document',
    description: 'Gets a Google Docs document by ID.',
    inputSchema: z.object({
      documentId: z.string()
    })
  })
  async getDocument(
    args: Simplify<
      SetRequired<google.docs_v1.Params$Resource$Documents$Get, 'documentId'>
    >
  ): Promise<googleDocs.Document> {
    const { documentId, ...opts } = args

    const { data } = await this.docs.documents.get({
      ...opts,
      documentId
    })

    return convertDocument(data)
  }
}

function convertDocument(
  data: google.docs_v1.Schema$Document
): googleDocs.Document {
  return pruneNullOrUndefinedDeep(data)
}
