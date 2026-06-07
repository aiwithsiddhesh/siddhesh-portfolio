import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { getPosts } from "@/lib/notion";

export const metadata = { title: "Blog — Siddhesh Parab" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts = await getPosts().catch(() => []);

  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Blog" title="Thinking Out<br/>Loud." />
          </RevealWrapper>

          {posts.length === 0 ? (
            <RevealWrapper delay={100}>
              <div
                className="p-8 rounded-2xl border-l-4"
                style={{ background: "var(--navy)", borderColor: "var(--lime)" }}
              >
                <p className="text-sm font-medium" style={{ color: "#a0aec0" }}>
                  Posts coming soon. Writing about AI quality engineering, LLM systems, and building tools that actually ship.
                </p>
              </div>
            </RevealWrapper>
          ) : (
            <div className="space-y-6">
              {posts.map((post, i) => (
                <RevealWrapper key={post.id} delay={i * 80}>
                  <Link href={`/blog/${post.slug}`}>
                    <div
                      className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
                    >
                      <div className="flex flex-wrap gap-2 mb-3">
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
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-xl font-black uppercase mb-3 leading-tight"
                        style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--lime)" }}>
                        Read More →
                      </div>
                    </div>
                  </Link>
                </RevealWrapper>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
