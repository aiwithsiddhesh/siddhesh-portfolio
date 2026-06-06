"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { person } from "@/lib/data";

const roles = person.roles;

export default function HomePage() {
  const twRef = useRef<HTMLSpanElement>(null);
  const state = useRef({ roleIdx: 0, charIdx: 0, deleting: false });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function type() {
      const el = twRef.current;
      const s = state.current;
      if (!el) return;
      const current = roles[s.roleIdx];
      if (s.deleting) {
        el.textContent = current.substring(0, --s.charIdx);
        if (s.charIdx < 0) {
          s.deleting = false;
          s.roleIdx = (s.roleIdx + 1) % roles.length;
          timeout = setTimeout(type, 400);
          return;
        }
        timeout = setTimeout(type, 50);
      } else {
        el.textContent = current.substring(0, ++s.charIdx);
        if (s.charIdx > current.length) {
          s.deleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
        timeout = setTimeout(type, 100);
      }
    }
    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center pt-20"
      style={{
        background:
          "radial-gradient(circle at bottom right, rgba(188,224,0,0.3) 0%, var(--cream) 60%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <h1
          className="font-black uppercase leading-none mb-6"
          style={{
            fontSize: "clamp(64px, 11vw, 120px)",
            letterSpacing: "-0.02em",
            color: "var(--navy)",
            fontFamily: "var(--font-oswald, sans-serif)",
          }}
        >
          Siddhesh
          <br />
          Parab
        </h1>

        <div
          className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center"
          style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)", minHeight: 32 }}
        >
          <span ref={twRef} />
          <span className="tw-cursor" />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {["OpenAI · Claude · LangChain", "RAG Pipelines", "7+ Years", "Pune, India"].map((t) => (
            <span
              key={t}
              className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
              style={{ background: "var(--navy)", color: "var(--lime)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-lg leading-relaxed mb-10 font-medium" style={{ color: "#4a5568", maxWidth: 680 }}>
          {person.tagline}
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "var(--lime)", color: "var(--navy)" }}
          >
            → See My Work
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide border-2 transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
          >
            Get In Touch
          </Link>
        </div>

        <div className="flex gap-4">
          {[
            { href: person.linkedin, label: "Li" },
            { href: person.github, label: "Gh" },
            { href: `mailto:${person.email}`, label: "@" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-all duration-200 hover:-translate-y-1 hover:bg-[#bce000]"
              style={{ background: "#fff", color: "var(--navy)", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
