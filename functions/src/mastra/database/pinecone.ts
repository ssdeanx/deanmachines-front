/**
 * Pinecone Vector Database Integration
 *
 * This module provides the configuration and utilities for working with
 * Pinecone vector database in the DeanMachines AI Platform.
 */
import { createLogger } from '@mastra/core/logger';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

// Initialize logger for Pinecone operations
const logger = createLogger({
  name: "pinecone-vector",
  level: process.env.LOG_LEVEL === "debug" ? "debug" : "info",
});

// Environment variable validation
const requireEnvVars = () => {
  const required = [
    'PINECONE_API_KEY',
    'PINECONE_ENVIRONMENT',
    'PINECONE_INDEX_NAME',
    'GOOGLE_API_KEY'
  ];
  
  const missing = required.filter(name => !process.env[name]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize Pinecone client
export const initPinecone = async () => {
  try {
    requireEnvVars();
    
    logger.info('Initializing Pinecone client...');
    
    // The Pinecone client automatically reads the API key and potentially other
    // configurations like controller host from environment variables if not provided.
    // PINECONE_API_KEY is read automatically.
    // PINECONE_ENVIRONMENT seems deprecated or not used in the constructor config.
    const pinecone = new Pinecone();
    
    // Verify the index exists
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const indexes = await pinecone.listIndexes();
    
    if (!indexes.indexes?.some(idx => idx.name === indexName)) {
      const availableIndexNames = (indexes.indexes || []).map(i => i.name).join(', ');
      logger.error(`Index '${indexName}' not found in Pinecone. Available indexes: ${availableIndexNames}`);
      throw new Error(`Pinecone index '${indexName}' not found`);
    }
    
    logger.info(`Successfully connected to Pinecone index: ${indexName}`);
    return pinecone;
    
  } catch (error) {
    logger.error('Failed to initialize Pinecone:', { error });
    throw error;
  }
};

// Create Google Generative AI embeddings model
export const createEmbeddings = () => {
  try {
    return new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: process.env.GOOGLE_EMBEDDINGS_MODEL || "models/embedding-001"
    });
  } catch (error) {
    logger.error('Failed to initialize Google embeddings:', { error });
    throw error;
  }
};

// Create Pinecone vector store with Google embeddings
export const createVectorStore = async () => {
  try {
    logger.info('Creating vector store with Google embeddings...');
    
    const pinecone = await initPinecone();
    const embeddings = createEmbeddings();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    
    return await PineconeStore.fromExistingIndex(
      embeddings,
      { 
        pineconeIndex: index,
        namespace: process.env.PINECONE_NAMESPACE || "default"
      }
    );
  } catch (error) {
    logger.error('Failed to create vector store:', { error });
    throw error;
  }
};

// Ensure proper initialization before use
let vectorStorePromise: Promise<PineconeStore> | null = null;

// Get a singleton instance of the vector store
export const getVectorStore = async () => {
  if (!vectorStorePromise) {
    vectorStorePromise = createVectorStore();
  }
  return vectorStorePromise;
};

// Utility to perform similarity search
export const similaritySearch = async (
  query: string, 
  k: number = 5,
  filters?: Record<string, unknown>
) => {
  try {
    logger.debug(`Performing similarity search for: "${query.substring(0, 30)}..."`);
    
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(query, k, filters);
    
    logger.debug(`Found ${results.length} similar documents`);
    return results;
  } catch (error) {
    logger.error('Error performing similarity search:', { error });
    throw error;
  }
};

// Utility to upsert documents to the vector store
export const upsertDocuments = async (
  documents: Array<{
    pageContent: string;
    metadata?: Record<string, any>;
  }>
) => {
  try {
    logger.debug(`Upserting ${documents.length} documents to vector store`);
    
    const vectorStore = await getVectorStore();
    // Ensure metadata is always an object, even if empty
    const docsWithMetadata = documents.map(doc => ({
      ...doc,
      metadata: doc.metadata || {},
    }));
    await vectorStore.addDocuments(docsWithMetadata);
    
    logger.debug('Documents successfully added to vector store');
    return { success: true, count: documents.length };
  } catch (error) {
    logger.error('Error upserting documents:', { error });
    throw error;
  }
};

export default {
  initPinecone,
  createEmbeddings,
  createVectorStore,
  getVectorStore,
  similaritySearch,
  upsertDocuments
};