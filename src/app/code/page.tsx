"use client";

import { useState, useRef } from "react";

interface CodeChunk {
  id: number;
  repo: string;
  filepath: string;
  language: string;
  content: string;
  start_line: number;
  similarity: number;
}

const SUGGESTIONS = [
  "LangChain RAG pipeline",
  "test case generation",
  "crew AI agents",
  "pytest fixtures",
  "CLI argument parsing",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-all hover:opacity-80"
      style={{ background: copied ? "var(--lime)" : "rgba(188,224,0,0.15)", color: copied ? "var(--navy)" : "var(--lime)" }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function LanguageBadge({ lang }: { lang: string }) {
  const colors: Record<string, string> = {
    python: "#3776ab", typescript: "#3178c6", javascript: "#f7df1e",
    markdown: "#083fa1",
  };
  return (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ background: colors[lang] ?? "#555", color: lang === "javascript" ? "#000" : "#fff" }}
    >
      {lang}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
      <div className="px-4 py-3 flex gap-3" style={{ background: "var(--navy)" }}>
        <div className="h-4 w-24 bg-white/20 rounded" />
        <div className="h-4 w-40 bg-white/10 rounded" />
      </div>
      <div className="p-4 space-y-2" style={{ background: "#1e2235" }}>
        {[80, 60, 90, 50, 70].map((w, i) => (
          <div key={i} className="h-3 rounded bg-white/10" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function CodePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CodeChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/code-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 6 }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResults(data.results ?? []);
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Hero */}
      <section className="py-16 px-6" style={{ background: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: "var(--lime)" }}>
            Code Explorer
          </p>
          <h1
            className="text-4xl md:text-6xl font-black uppercase leading-none mb-4"
            style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--cream)" }}
          >
            Search My<br />Real Code
          </h1>
          <p className="text-sm font-medium mb-8" style={{ color: "rgba(251,251,234,0.6)" }}>
            Semantic search across all my public GitHub repos — find actual implementations, not summaries.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='e.g. "LangChain RAG pipeline"'
              className="flex-1 px-5 py-3 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "var(--cream)",
                border: "1px solid rgba(188,224,0,0.3)",
                "--tw-ring-color": "var(--lime)",
              } as any}
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              style={{ background: "var(--lime)", color: "var(--navy)" }}
            >
              Search
            </button>
          </form>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => search(s)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                style={{ background: "rgba(188,224,0,0.12)", color: "var(--lime)", border: "1px solid rgba(188,224,0,0.25)" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {loading && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-6" style={{ color: "rgba(22,26,40,0.4)" }}>
                Searching across repos...
              </p>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-red-500">{error}</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && !error && (
            <div className="text-center py-16">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-bold" style={{ color: "var(--navy)" }}>No results found</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or a broader query</p>
            </div>
          )}

          {!loading && results.map((r, i) => (
            <div
              key={r.id}
              className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* File header */}
              <div
                className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap"
                style={{ background: "var(--navy)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <LanguageBadge lang={r.language} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--lime)" }}>
                    {r.repo}
                  </span>
                  <span className="text-xs font-medium truncate" style={{ color: "rgba(251,251,234,0.5)" }}>
                    {r.filepath}
                    {r.start_line > 1 ? `:${r.start_line}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-bold" style={{ color: "rgba(188,224,0,0.6)" }}>
                    {Math.round(r.similarity * 100)}% match
                  </span>
                  <CopyButton text={r.content} />
                  <a
                    href={`https://github.com/aiwithsiddhesh/${r.repo}/blob/HEAD/${r.filepath}${r.start_line > 1 ? `#L${r.start_line}` : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest hover:opacity-75 transition-opacity"
                    style={{ color: "rgba(251,251,234,0.5)" }}
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* Code block */}
              <pre
                className="overflow-x-auto text-xs leading-relaxed p-5"
                style={{ background: "#1e2235", color: "#e2e8f0", fontFamily: "monospace", margin: 0 }}
              >
                <code>{r.content}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
