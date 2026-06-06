"use client";
import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { achievements, person } from "@/lib/data";

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let count = 0;
        const step = Math.ceil(value / 60);
        const timer = setInterval(() => {
          count = Math.min(count + step, value);
          el.textContent = count + suffix;
          if (count >= value) clearInterval(timer);
        }, 20);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, suffix]);

  return (
    <div
      className="p-8 rounded-2xl text-center"
      style={{ background: "var(--navy-light)" }}
    >
      <div
        ref={numRef}
        className="text-5xl font-black mb-2"
        style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "#fff" }}
      >
        0{suffix}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a0aec0" }}>
        {label}
      </div>
    </div>
  );
}

export default function WinsPage() {
  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader tag="Impact" title="Numbers That<br/>Matter." dark />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {person.stats.map((s) => (
              <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>

          <div className="space-y-4">
            {achievements.map((a, i) => (
              <RevealWrapper key={i} delay={i * 60}>
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
