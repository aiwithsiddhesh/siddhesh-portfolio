import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, role, content, provider } = await req.json();

    const notionKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_CHAT_LOGS_DB_ID;

    if (!notionKey || !dbId) {
      // Silently fail or log locally if not configured, to not break the chat UI
      console.warn("Notion Chat Logs not configured");
      return NextResponse.json({ success: false, message: "Not configured" });
    }

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          Name: {
            title: [{ text: { content: content.slice(0, 2000) } }],
          },
          Role: {
            select: { name: role === "user" ? "User" : "Siddhesh" },
          },
          "Session ID": {
            rich_text: [{ text: { content: sessionId } }],
          },
          Provider: {
            select: { name: provider || "User" },
          },
          Timestamp: {
            date: { start: new Date().toISOString() },
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Notion chat log failed [${res.status}]:`, err);
      return NextResponse.json({ error: `Notion Error: ${res.status}`, detail: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat Log API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
