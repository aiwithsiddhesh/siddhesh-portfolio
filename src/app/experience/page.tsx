import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { experience } from "@/lib/data";

export const metadata = { title: "Experience — Siddhesh Parab" };

export default function ExperiencePage() {
  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Experience" title="Where I've<br/>Shipped." />
          </RevealWrapper>

          <div className="relative pl-8 border-l-2" style={{ borderColor: "var(--navy)" }}>
            {experience.map((job, i) => (
              <div key={i} className="relative mb-12 last:mb-0">
                {/* Timeline dot */}
                <div
                  className="absolute -left-[37px] top-0 w-3.5 h-3.5 rounded-full border-2"
                  style={{ background: "var(--lime)", borderColor: "var(--navy)" }}
                />
                <RevealWrapper delay={i * 80}>
                  <div
                    className="p-8 rounded-2xl"
                    style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                      <div>
                        <h3
                          className="text-2xl font-black uppercase"
                          style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
                        >
                          {job.title}
                        </h3>
                        <p className="text-sm font-bold uppercase tracking-wider mt-1" style={{ color: "#4a5568" }}>
                          {job.company}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-bold uppercase"
                        style={{ background: "var(--lime)", color: "var(--navy)" }}
                      >
                        {job.badge}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-5" style={{ color: "#718096" }}>
                      <span>📅 {job.period}</span>
                      <span>📍 {job.location}</span>
                    </div>

                    <p className="text-sm leading-relaxed mb-5 font-medium" style={{ color: "#4a5568" }}>
                      {job.summary}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3 text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                          <span className="font-bold mt-0.5 shrink-0" style={{ color: "var(--lime)" }}>→</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.stack.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: "var(--navy)", color: "#fff" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </RevealWrapper>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
