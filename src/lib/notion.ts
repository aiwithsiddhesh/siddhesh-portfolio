import "server-only";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

async function queryNotionDatabase(databaseId: string, params: any = {}): Promise<any> {
  if (!databaseId) {
    throw new Error("Missing database ID");
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Notion API Error: ${response.status} ${text}`);
    throw new Error(`Notion API Error: ${response.status} ${text}`);
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
  const dbId = process.env.NOTION_CERTS_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_CERTS_DATABASE_ID");

  const response = await queryNotionDatabase(dbId, {
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

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  roles: string[];
  openTo: string[];
  taglineBadges: string[];
  skillsStack: string[];
}

export async function getProfile(): Promise<Profile | null> {
  const dbId = process.env.NOTION_PROFILE_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_PROFILE_DATABASE_ID");

  const response = await queryNotionDatabase(dbId);
  
  if (!response.results || response.results.length === 0) return null;
  
  const page = response.results[0];
  const props = page.properties ?? {};
  
  return {
    name: getText(props["Name"]?.title ?? []),
    tagline: getText(props["Tagline"]?.rich_text ?? []),
    bio: getText(props["Bio"]?.rich_text ?? []),
    location: getText(props["Location"]?.rich_text ?? []),
    email: props["Email"]?.email || "",
    phone: props["Phone"]?.phone_number || "",
    linkedin: props["LinkedIn"]?.url || "",
    github: props["GitHub"]?.url || "",
    roles: (props["Roles"]?.multi_select ?? []).map((s: any) => s.name),
    openTo: (props["OpenTo"]?.multi_select ?? []).map((s: any) => s.name),
    taglineBadges: (props["TaglineBadges"]?.multi_select ?? []).map((s: any) => s.name),
    skillsStack: (props["SkillsStack"]?.multi_select ?? []).map((s: any) => s.name),
  };
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
  const dbId = process.env.NOTION_ACHIEVEMENTS_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_ACHIEVEMENTS_DATABASE_ID");

  const response = await queryNotionDatabase(dbId, {
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
  const dbId = process.env.NOTION_STATS_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_STATS_DATABASE_ID");

  const response = await queryNotionDatabase(dbId, {
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
  const dbId = process.env.NOTION_EXPERIENCE_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_EXPERIENCE_DATABASE_ID");

  const response = await queryNotionDatabase(dbId, {
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

export interface Project {
  id: string;
  title: string;
  slug: string;
  type: string;
  desc: string;
  outcomes: string[];
  stack: string[];
  github: string | null;
  pypi: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const dbId = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_PROJECTS_DATABASE_ID");

  const response = await queryNotionDatabase(dbId, {
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return (response.results ?? []).map((page: any) => {
    const props = page.properties ?? {};
    const outcomesText = getText(props["Outcomes"]?.rich_text ?? []);
    return {
      id: page.id,
      title: getText(props["Title"]?.title ?? []),
      slug: getText(props["Slug"]?.rich_text ?? []),
      type: getText(props["Type"]?.rich_text ?? []),
      desc: getText(props["Description"]?.rich_text ?? []),
      outcomes: outcomesText ? outcomesText.split("\n").map(b => b.trim()).filter(Boolean) : [],
      stack: (props["Stack"]?.multi_select ?? []).map((s: any) => s.name),
      github: props["GitHub"]?.url || null,
      pypi: props["PyPI"]?.url || null,
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

export async function getPosts(): Promise<BlogPost[]> {
  const dbId = process.env.NOTION_BLOG_DATABASE_ID;
  if (!dbId) throw new Error("Missing NOTION_BLOG_DATABASE_ID");
  
  const response = await queryNotionDatabase(dbId, {
    filter: { property: "Published", checkbox: { equals: true } },
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
