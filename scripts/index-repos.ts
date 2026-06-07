/**
 * Run once (and re-run when repos change):
 *   npx tsx scripts/index-repos.ts
 *
 * Fetches all public repos for aiwithsiddhesh, chunks code files,
 * embeds via Gemini, and upserts into Supabase pgvector.
 */

import { createClient } from "@supabase/supabase-js";

const GITHUB_USER = "aiwithsiddhesh";
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const INDEXABLE_EXTENSIONS = /\.(py|ts|js|tsx|jsx|md)$/;
const SKIP_PATHS = /node_modules|\.next|dist|build|\.git|package-lock|\.min\.|__pycache__/;
const CHUNK_LINES = 60;
const OVERLAP_LINES = 10;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function githubFetch(url: string) {
  const res = await fetch(url, {
    headers: { "Accept": "application/vnd.github+json", "User-Agent": "portfolio-indexer" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${url}`);
  return res.json() as Promise<any>;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: texts.map(text => ({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text }] },
        })),
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini embed error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json() as any;
  return data.embeddings.map((e: any) => e.values);
}

function chunkCode(content: string, filepath: string): { content: string; startLine: number }[] {
  const lines = content.split("\n");
  const chunks: { content: string; startLine: number }[] = [];
  let i = 0;
  while (i < lines.length) {
    const slice = lines.slice(i, i + CHUNK_LINES);
    const chunkText = `// File: ${filepath}\n` + slice.join("\n");
    chunks.push({ content: chunkText, startLine: i + 1 });
    i += CHUNK_LINES - OVERLAP_LINES;
  }
  return chunks;
}

function detectLanguage(filepath: string): string {
  const ext = filepath.split(".").pop() ?? "";
  const map: Record<string, string> = {
    py: "python", ts: "typescript", tsx: "typescript",
    js: "javascript", jsx: "javascript", md: "markdown",
  };
  return map[ext] ?? ext;
}

async function indexRepo(repoName: string) {
  console.log(`\n→ Indexing ${repoName}...`);

  // Get file tree
  const tree = await githubFetch(
    `https://api.github.com/repos/${GITHUB_USER}/${repoName}/git/trees/HEAD?recursive=1`
  );
  if (!tree.tree) { console.log(`  Skipping — no tree`); return; }

  const files = (tree.tree as any[]).filter(
    f => f.type === "blob" && INDEXABLE_EXTENSIONS.test(f.path) && !SKIP_PATHS.test(f.path)
  );
  console.log(`  ${files.length} indexable files`);

  // Clear existing chunks for this repo
  await supabase.from("code_chunks").delete().eq("repo", repoName);

  let totalChunks = 0;

  for (const file of files) {
    try {
      const raw = await fetch(
        `https://raw.githubusercontent.com/${GITHUB_USER}/${repoName}/HEAD/${file.path}`
      );
      if (!raw.ok) continue;
      const content = await raw.text();
      if (content.length > 100_000) { console.log(`  Skipping large file: ${file.path}`); continue; }

      const chunks = chunkCode(content, file.path);
      const language = detectLanguage(file.path);

      // Embed in batches of 10
      for (let b = 0; b < chunks.length; b += 10) {
        const batch = chunks.slice(b, b + 10);
        const embeddings = await embedTexts(batch.map(c => c.content));

        const rows = batch.map((chunk, i) => ({
          repo: repoName,
          filepath: file.path,
          language,
          content: chunk.content,
          start_line: chunk.startLine,
          embedding: JSON.stringify(embeddings[i]),
        }));

        const { error } = await supabase.from("code_chunks").insert(rows);
        if (error) console.error(`  Insert error: ${error.message}`);
        else totalChunks += rows.length;

        // Small delay to avoid Gemini rate limits
        await new Promise(r => setTimeout(r, 200));
      }

      process.stdout.write(`  ✓ ${file.path} (${chunks.length} chunks)\n`);
    } catch (err: any) {
      console.error(`  Error on ${file.path}: ${err.message}`);
    }
  }

  console.log(`  Done: ${totalChunks} chunks indexed for ${repoName}`);
}

async function main() {
  console.log("Fetching public repos...");
  const repos = await githubFetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=public`
  ) as any[];

  const toIndex = repos.filter(r => !r.fork && r.size > 0);
  console.log(`Found ${toIndex.length} repos to index`);

  for (const repo of toIndex) {
    await indexRepo(repo.name);
  }

  const { count } = await supabase.from("code_chunks").select("*", { count: "exact", head: true });
  console.log(`\n✅ Indexing complete. Total chunks in DB: ${count}`);
}

main().catch(err => { console.error(err); process.exit(1); });
