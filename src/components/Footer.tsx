import Link from "next/link";
import { person } from "@/lib/data";

export default function Footer() {
  return (
    <footer
      className="py-16 text-center"
      style={{ background: "var(--navy)", color: "#fff" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="text-3xl font-black uppercase tracking-widest mb-3"
          style={{ color: "var(--lime)" }}
        >
          {person.name}
        </div>
        <p className="text-base mb-6" style={{ color: "#a0aec0", maxWidth: 500, margin: "0 auto 24px" }}>
          AI Quality & Automation Engineer — building LLM systems and AI workflows that actually ship.
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold uppercase tracking-widest transition-colors duration-200 hover:text-[#bce000]"
            style={{ color: "#a0aec0" }}
          >
            LinkedIn
          </a>
          <a
            href={person.github}
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold uppercase tracking-widest transition-colors duration-200 hover:text-[#bce000]"
            style={{ color: "#a0aec0" }}
          >
            GitHub
          </a>
          <a
            href={`mailto:${person.email}`}
            className="text-sm font-semibold uppercase tracking-widest transition-colors duration-200 hover:text-[#bce000]"
            style={{ color: "#a0aec0" }}
          >
            Email
          </a>
        </div>
        <p className="text-xs" style={{ color: "#4a5568" }}>
          © {new Date().getFullYear()} Siddhesh Parab
        </p>
      </div>
    </footer>
  );
}
