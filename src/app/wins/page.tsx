import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import StatCard from "./StatCard";
import { getAchievements, getStats } from "@/lib/notion";

export const metadata = { title: "Wins — Siddhesh Parab" };
export const dynamic = "force-dynamic";

export default async function WinsPage() {
  const achievements = await getAchievements().catch(() => []);
  const stats = await getStats().catch(() => []);

  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader tag="Impact" title="Numbers That<br/>Matter." dark />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((s) => (
              <StatCard key={s.id} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>

          <div className="space-y-4">
            {achievements.map((a, i) => (
              <RevealWrapper key={a.id} delay={i * 60}>
                <div
                  className="p-6 rounded-2xl flex gap-6 items-start transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "var(--navy-light)" }}
                >
                  <div
                    className="text-xl font-black shrink-0 w-14"
                    style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--lime)" }}
                  >
                    {a.year}
                  </div>
                  <div>
                    <span
                      className="inline-block px-3 py-0.5 rounded text-xs font-bold uppercase mb-2"
                      style={{ background: "var(--lime)", color: "var(--navy)" }}
                    >
                      {a.category}
                    </span>
                    <h3
                      className="text-lg font-black uppercase mb-1"
                      style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "#fff" }}
                    >
                      {a.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#a0aec0" }}>
                      {a.desc}
                    </p>
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
