import { mastra } from "@/mastra";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { city } = await req.json();
  const agent = mastra.getAgent("writerAgent");

  const result = await agent.stream(`What's the weather like in ${city}?`);

  return result.toDataStreamResponse();
}
