import { Index } from "@upstash/vector"
import process from "node:process";

// Use environment variables for URL and TOKEN
const url = process.env.UPSTASH_VECTOR_REST_URL!;
const token = process.env.UPSTASH_VECTOR_REST_TOKEN!;

const index = new Index({
  url,
  token,
});

async function main() {
  await index.query({
    data: "Enter data as string",
    topK: 1,
    includeVectors: true,
    includeMetadata: true,
  });
}

main();