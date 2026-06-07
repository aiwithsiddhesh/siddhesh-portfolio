import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function embedQuery(query: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text: query }] },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini embed ${res.status}`);
  const data = await res.json() as any;
  return data.embedding.values;
}

export async function POST(req: NextRequest) {
  try {
    const { query, limit = 5 } = await req.json();
    if (!query?.trim()) return NextResponse.json({ results: [] });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const embedding = await embedQuery(query);

    const { data, error } = await supabase.rpc("search_code", {
      query_embedding: embedding,
      match_count: limit,
    });

    if (error) {
      console.error("Supabase search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ results: data ?? [] });
  } catch (err: any) {
    console.error("Code search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
