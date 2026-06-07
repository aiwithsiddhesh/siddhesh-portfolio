import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPosts } from "@/lib/notion";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Siddhesh Parab`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-3xl mx-auto px-6">

          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-10 transition-colors duration-200 hover:text-[#bce000]"
            style={{ color: "#718096" }}
          >
            ← Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-0.5 rounded-full text-xs font-bold uppercase"
                  style={{ background: "var(--navy)", color: "var(--lime)" }}
                >
                  {t}
                </span>
              ))}
              {post.date && (
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: "#f0f0e0", color: "#718096" }}
                >
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </span>
              )}
            </div>
            <h1
              className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4"
              style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg leading-relaxed font-medium" style={{ color: "#4a5568" }}>
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Cover image */}
          {post.cover && (
            <div className="rounded-2xl overflow-hidden mb-10">
              <img src={post.cover} alt={post.title} className="w-full object-cover" style={{ maxHeight: 400 }} />
            </div>
          )}

          {/* Divider */}
          <div className="w-16 h-1 rounded mb-10" style={{ background: "var(--lime)" }} />

          {/* Content */}
          <div
            className="prose-custom"
            style={{
              color: "#2d3748",
              lineHeight: 1.8,
              fontSize: 17,
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.markdown) }}
          />
        </div>
      </section>
    </div>
  );
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 style="font-family:var(--font-oswald,sans-serif);font-size:1.4rem;font-weight:900;text-transform:uppercase;color:#161A28;margin:2rem 0 0.75rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-family:var(--font-oswald,sans-serif);font-size:1.8rem;font-weight:900;text-transform:uppercase;color:#161A28;margin:2.5rem 0 1rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-family:var(--font-oswald,sans-serif);font-size:2.2rem;font-weight:900;text-transform:uppercase;color:#161A28;margin:2.5rem 0 1rem">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#161A28;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#f0f0e0;padding:2px 6px;border-radius:4px;font-size:0.875em;color:#161A28">$1</code>')
    .replace(/^\- (.+)$/gm, '<li style="padding-left:8px;margin-bottom:6px;list-style:none;display:flex;gap:8px"><span style="color:#bce000;font-weight:bold;flex-shrink:0">→</span><span>$1</span></li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="margin:1rem 0;padding:0">$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li style="padding-left:8px;margin-bottom:6px">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#bce000;font-weight:600;text-decoration:underline">$1</a>')
    .replace(/^(?!<[a-z])(.+)$/gm, '<p style="margin-bottom:1.2rem">$1</p>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:2px solid #f0f0e0;margin:2rem 0">')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre style="background:#161A28;color:#bce000;padding:20px;border-radius:12px;overflow-x:auto;margin:1.5rem 0;font-size:14px"><code>$1</code></pre>');
}
