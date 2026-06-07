"use client";
import { useEffect, useRef } from "react";

export default function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
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
