import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, firstQuestion, pageId } = await req.json();

    const notionKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_LEADS_DB_ID;

    if (!notionKey || !dbId) {
      return NextResponse.json({ error: "Notion not configured" }, { status: 500 });
    }

    const properties: Record<string, any> = {};

    if (name) {
      properties["Name"] = {
        title: [{ text: { content: name } }],
      };
    } else if (!pageId) {
      properties["Name"] = {
        title: [{ text: { content: "Anonymous Visitor" } }],
      };
    }

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

    // Only set these on creation
    if (!pageId) {
      properties["Submitted At"] = {
        date: { start: new Date().toISOString() },
      };
      properties["Status"] = {
        select: { name: "New" },
      };
    }

    let res;
    if (pageId) {
      // UPDATE existing page
      res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${notionKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      });
    } else {
      // CREATE new page
      res = await fetch("https://api.notion.com/v1/pages", {
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
    }

    if (!res.ok) {
      const err = await res.text();
      console.error(`Notion lead operation failed [${res.status}]:`, err);
      console.error("Payload sent:", JSON.stringify({ properties }));
      return NextResponse.json({ error: `Notion Error: ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
