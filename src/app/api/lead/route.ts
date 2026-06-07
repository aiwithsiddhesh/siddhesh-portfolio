import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, firstQuestion } = await req.json();

    // At least one field must be filled
    if (!name && !email && !company) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const notionKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_LEADS_DB_ID;

    if (!notionKey || !dbId) {
      return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
    }

    const now = new Date().toISOString();

    const properties: Record<string, any> = {
      Name: {
        title: [{ text: { content: name || "Anonymous Visitor" } }],
      },
      "Submitted At": {
        date: { start: now },
      },
      Status: {
        select: { name: "New" },
      },
    };

    if (email) {
      properties["Email"] = {
        rich_text: [{ text: { content: email } }],
      };
    }

    if (company) {
      properties["Company"] = {
        rich_text: [{ text: { content: company } }],
      };
    }

    if (firstQuestion) {
      properties["First Question"] = {
        rich_text: [{ text: { content: firstQuestion.slice(0, 2000) } }],
      };
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
        properties,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Notion lead save failed:", err);
      return NextResponse.json({ error: "Failed to save to Notion" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
