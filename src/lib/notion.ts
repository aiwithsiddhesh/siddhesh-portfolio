import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion as any });

const DB_ID = process.env.NOTION_BLOG_DATABASE_ID!;
const CERTS_DB_ID = process.env.NOTION_CERTS_DATABASE_ID!;
const ACHIEVEMENTS_DB_ID = process.env.NOTION_ACHIEVEMENTS_DATABASE_ID!;
const STATS_DB_ID = process.env.NOTION_STATS_DATABASE_ID!;
const EXPERIENCE_DB_ID = process.env.NOTION_EXPERIENCE_DATABASE_ID!;

async function queryNotionDatabase(databaseId: string, params: any = {}): Promise<any> {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    console.error("Notion query failed:", response.status, await response.text());
    throw new Error(`Notion API error: ${response.status}`);
  }
  return response.json();
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  icon: string;
  link: string | null;
}

export async function getCertifications(): Promise<Certification[]> {
  const response = await queryNotionDatabase(CERTS_DB_ID, {
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Year", direction: "ascending" }],
  });

  return (response.results ?? []).map((page: any) => {
    const props = page.properties ?? {};
    return {
      id: page.id,
      title: getText(props["Title"]?.title ?? []),
      issuer: getText(props["Issuer"]?.rich_text ?? []),
      year: getText(props["Year"]?.rich_text ?? []),
      icon: getText(props["Icon"]?.rich_text ?? []) || "🏅",
      link: props["Link"]?.url ?? null,
    };
  });
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  cover: string | null;
}

export interface BlogPostWithContent extends BlogPost {
  markdown: string;
}

export interface Achievement {
  id: string;
  year: string;
  category: string;
  title: string;
  desc: string;
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!ACHIEVEMENTS_DB_ID) return [];
  const response = await queryNotionDatabase(ACHIEVEMENTS_DB_ID, {
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return (response.results ?? []).map((page: any) => {
    const props = page.properties ?? {};
    return {
      id: page.id,
      year: getText(props["Year"]?.rich_text ?? []),
      category: props["Category"]?.select?.name ?? "General",
      title: getText(props["Title"]?.title ?? []),
      desc: getText(props["Description"]?.rich_text ?? []),
    };
  });
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export async function getStats(): Promise<Stat[]> {
  if (!STATS_DB_ID) return [];
  const response = await queryNotionDatabase(STATS_DB_ID, {
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return (response.results ?? []).map((page: any) => {
    const props = page.properties ?? {};
    return {
      id: page.id,
      value: props["Value"]?.number ?? 0,
      suffix: getText(props["Suffix"]?.rich_text ?? []),
      label: getText(props["Label"]?.title ?? []),
    };
  });
}

export interface JobExperience {
  id: string;
  title: string;
  company: string;
  badge: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  stack: string[];
}

export async function getExperience(): Promise<JobExperience[]> {
  if (!EXPERIENCE_DB_ID) return [];
  const response = await queryNotionDatabase(EXPERIENCE_DB_ID, {
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return (response.results ?? []).map((page: any) => {
    const props = page.properties ?? {};
    const bulletsText = getText(props["Bullets"]?.rich_text ?? []);
    return {
      id: page.id,
      title: getText(props["Title"]?.title ?? []),
      company: getText(props["Company"]?.rich_text ?? []),
      badge: getText(props["Badge"]?.rich_text ?? []),
      period: getText(props["Period"]?.rich_text ?? []),
      location: getText(props["Location"]?.rich_text ?? []),
      summary: getText(props["Summary"]?.rich_text ?? []),
      bullets: bulletsText ? bulletsText.split("\n").map(b => b.trim()).filter(Boolean) : [],
      stack: (props["Stack"]?.multi_select ?? []).map((s: any) => s.name),
    };
  });
}

function getText(rich: any[]): string {
  return (rich ?? []).map((r: any) => r.plain_text).join("");
}

function extractPost(page: any): BlogPost {
  const props = page.properties ?? {};

  const title =
    getText(props["Title"]?.title) ||
    getText(props["Name"]?.title) ||
    "Untitled";

  const date = props["Date"]?.date?.start ?? page.created_time?.split("T")[0] ?? "";

  const tags: string[] =
    (props["Tags"]?.multi_select ?? []).map((t: any) => t.name);

  const excerpt = getText(props["Excerpt"]?.rich_text ?? []);

  const rawSlug = getText(props["Slug"]?.rich_text ?? []);
  const slug = rawSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const cover =
    page.cover?.type === "external"
      ? page.cover.external.url
      : page.cover?.type === "file"
      ? page.cover.file.url
      : null;

  return { id: page.id, slug, title, date, tags, excerpt, cover };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const response = await queryNotionDatabase(DB_ID, {
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return (response.results ?? []).map(extractPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  // try matching by Slug field first
  const response = await queryNotionDatabase(DB_ID, {
    filter: {
      and: [
        { property: "Published", checkbox: { equals: true } },
        { property: "Slug", rich_text: { equals: slug } },
      ],
    },
  });

  let page = response.results?.[0];

  // fallback: scan all published and match auto-slug from title
  if (!page) {
    const all = await queryNotionDatabase(DB_ID, {
      filter: { property: "Published", checkbox: { equals: true } },
    });
    page = (all.results ?? []).find((p: any) => extractPost(p).slug === slug);
  }

  if (!page) return null;

  const post = extractPost(page);
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const markdown = n2m.toMarkdownString(mdBlocks).parent;

  return { ...post, markdown };
}
