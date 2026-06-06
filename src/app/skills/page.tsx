"use client";
import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { skills } from "@/lib/data";

export default function SkillsPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".skill-card");
    if (!cards) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>(".skill-fill").forEach((bar) => {
              bar.style.width = bar.dataset.pct + "%";
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader tag="Skills" title="Tools I<br/>Deploy." dark />

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((cat, i) => (
              <div
                key={i}
                className="skill-card p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--navy-light)" }}
              >
                <div
                  className="text-xl font-black uppercase mb-6 flex items-center gap-3"
                  style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "#fff" }}
                >
                  <span>{cat.icon}</span>
                  {cat.category}
                </div>
                <div className="space-y-4">
                  {cat.items.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: "#a0aec0" }}>
                          {skill.name}
                        </span>
                        <span className="text-sm font-bold" style={{ color: "var(--lime)" }}>
                          {skill.pct}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <div
                          className="skill-fill"
                          data-pct={skill.pct}
                          style={{ height: "100%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
