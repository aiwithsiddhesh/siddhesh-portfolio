import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { education } from "@/lib/data";

export const metadata = { title: "Education — Siddhesh Parab" };

export default function EducationPage() {
  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Education" title="Academic<br/>Foundation." />
          </RevealWrapper>

          {education.map((e, i) => (
            <RevealWrapper key={i} delay={i * 80}>
              <div
                className="p-8 rounded-2xl mb-6"
                style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
              >
                <h3
                  className="text-2xl font-black uppercase mb-2"
                  style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
                >
                  {e.degree}
                </h3>
                <p className="font-semibold mb-4" style={{ color: "#4a5568" }}>
                  {e.school}
                </p>
                <div className="flex flex-wrap gap-4 text-sm mb-6" style={{ color: "#718096" }}>
                  <span>📅 {e.period}</span>
                  <span>📍 {e.location}</span>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--navy)" }}>
                  How It Connects
                </h4>
                <ul className="space-y-2">
                  {e.highlights.map((h, j) => (
                    <li key={j} className="flex gap-3 text-sm" style={{ color: "#4a5568" }}>
                      <span className="font-bold shrink-0" style={{ color: "var(--lime)" }}>→</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealWrapper>
          ))}

          {/* Context card */}
          <RevealWrapper delay={150}>
            <div
              className="p-8 rounded-2xl border-l-4"
              style={{ background: "var(--navy)", borderColor: "var(--lime)" }}
            >
              <h4
                className="text-lg font-black uppercase mb-3"
                style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--lime)" }}
              >
                The Real Degree
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "#a0aec0" }}>
                Seven years solving problems nobody could name yet — in plastic part validation, medical-grade CAD, and AI systems — is the education that matters. The degree gave me a foundation in systems thinking. The work gave me everything else.
              </p>
            </div>
          </RevealWrapper>
        </div>
      </section>
    </div>
  );
}
