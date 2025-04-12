import { NextResponse } from "next/server";

// This file is kept for compatibility but not used in static exports
// Authentication is handled client-side through src/lib/auth-client.ts

// Empty handlers for static export compatibility
export const GET = async () =>
  new Response(JSON.stringify({ error: "Not implemented in static export" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

export const POST = async () =>
  new Response(JSON.stringify({ error: "Not implemented in static export" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
