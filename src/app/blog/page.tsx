import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";

export const metadata = { title: "Blog — Siddhesh Parab" };

const placeholderPosts = [
  {
    title: "How I Built a RAG Validation Framework That Actually Catches Hallucinations",
    excerpt: "Most RAG systems ship without measurable quality gates. Here's the LangChain + Claude API pipeline I built to replace gut-feel with release metrics.",
    date: "Coming Soon",
    tags: ["AI Engineering", "RAG", "LangChain"],
  },
  {
    title: "Why AI-First QA Is Different — and Why Most Teams Get It Wrong",
    excerpt: "AI systems fail differently than traditional software. The failure modes are probabilistic, latent, and often invisible until prod. Here's how I think about quality in LLM systems.",
    date: "Coming Soon",
    tags: ["AI QA", "LLM", "Strategy"],
  },
  {
    title: "qa-kit: From Internal Tool to Open Source CLI in 6 Weeks",
    excerpt: "I built qa-kit to solve a specific internal QA problem. Here's how it evolved into a reusable framework, what I got wrong the first time, and what made it to PyPI.",
    date: "Coming Soon",
    tags: ["Open Source", "Python", "CLI"],
  },
];

export default function BlogPage() {
  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Blog" title="Thinking Out<br/>Loud." />
          </RevealWrapper>

          <div
            className="p-6 rounded-2xl mb-12 border-l-4"
            style={{ background: "var(--navy)", borderColor: "var(--lime)" }}
          >
            <p className="text-sm font-medium" style={{ color: "#a0aec0" }}>
              Posts coming soon. Writing about AI quality engineering, LLM systems, and building tools that actually ship.
            </p>
          </div>

          <div className="space-y-6">
            {placeholderPosts.map((post, i) => (
              <RevealWrapper key={i} delay={i * 80}>
                <div
                  className="p-8 rounded-2xl opacity-60 cursor-default"
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
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase" style={{ background: "#f7f7e8", color: "#718096" }}>
                      {post.date}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-black uppercase mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                    {post.excerpt}
                  </p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
