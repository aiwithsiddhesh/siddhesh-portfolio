import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { getProjects } from "@/lib/notion";

export const metadata = { title: "Projects — Siddhesh Parab" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects().catch((err: any) => [{
    id: "error",
    title: "ERROR",
    slug: "error",
    type: "ERROR",
    desc: err.message || String(err),
    outcomes: ["Check Vercel Environment Variables", "Check Notion Integration Permissions"],
    stack: [],
    github: null,
    pypi: null
  }]);

  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Projects" title="Things I've<br/>Built." dark />
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <RevealWrapper key={p.id} delay={i * 100}>
                <div
                  className="p-8 rounded-2xl h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "var(--navy-light)", boxShadow: "none" }}
                >
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-4"
                    style={{ background: "var(--lime)", color: "var(--navy)" }}
                  >
                    {p.type}
                  </span>

                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className="text-2xl font-black uppercase"
                      style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "#fff" }}
                    >
                      {p.title}
                    </h3>
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener"
                        className="text-sm font-bold transition-colors duration-200 hover:text-[#bce000]"
                        style={{ color: "#a0aec0" }}
                      >
                        GH ↗
                      </a>
                    )}
                    {p.pypi && (
                      <a
                        href={p.pypi}
                        target="_blank"
                        rel="noopener"
                        className="text-sm font-bold transition-colors duration-200 hover:text-[#bce000]"
                        style={{ color: "#a0aec0" }}
                      >
                        PyPI ↗
                      </a>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed mb-5" style={{ color: "#a0aec0" }}>
                    {p.desc}
                  </p>

                  <div className="mb-6 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a0aec0" }}>
                      Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {p.outcomes.map((o, j) => (
                        <li key={j} className="flex gap-2 text-sm" style={{ color: "#cbd5e0" }}>
                          <span className="font-bold shrink-0" style={{ color: "var(--lime)" }}>→</span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
