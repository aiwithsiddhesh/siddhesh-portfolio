import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { getCertifications } from "@/lib/notion";

export const metadata = { title: "Certifications — Siddhesh Parab" };
export const revalidate = 1800;

export default async function CertificationsPage() {
  const certifications = await getCertifications().catch(() => []);

  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Certifications" title="Always<br/>Learning." />
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((c, i) => (
              <RevealWrapper key={c.id} delay={i * 60}>
                <div
                  className="p-6 rounded-2xl flex gap-4 items-start transition-all duration-300 hover:-translate-y-1 h-full"
                  style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
                >
                  <span className="text-3xl shrink-0">{c.icon}</span>
                  <div>
                    <h3
                      className="text-base font-black uppercase mb-1 leading-tight"
                      style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
                    >
                      {c.title}
                    </h3>
                    <p className="text-xs font-medium mb-2" style={{ color: "#718096" }}>
                      {c.issuer} · {c.year}
                    </p>
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noopener"
                        className="text-xs font-bold uppercase tracking-wide transition-colors duration-200 hover:opacity-70"
                        style={{ color: "var(--lime)", background: "var(--navy)", padding: "2px 8px", borderRadius: 4 }}
                      >
                        Verify ↗
                      </a>
                    )}
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>

          <RevealWrapper delay={200}>
            <div
              className="mt-12 p-8 rounded-2xl text-center border-t-4"
              style={{ background: "var(--navy)", borderColor: "var(--lime)" }}
            >
              <p
                className="text-2xl font-black uppercase mb-2"
                style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--lime)" }}
              >
                {certifications.length}× Certified
              </p>
              <p className="text-sm" style={{ color: "#a0aec0" }}>
                5× Anthropic · 2× DeepLearning.AI — all with verify links
              </p>
            </div>
          </RevealWrapper>
        </div>
      </section>
    </div>
  );
}
