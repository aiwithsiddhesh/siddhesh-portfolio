import Link from "next/link";
import { getProfile } from "@/lib/notion";
import TypingAnimation from "@/components/TypingAnimation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const person = await getProfile();

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-center">
        <h1 className="text-3xl font-bold">Profile Data Missing</h1>
        <p className="mt-4 text-gray-400">Please check your Notion connection.</p>
      </div>
    );
  }

  const { name, tagline, roles, taglineBadges, linkedin, github, email } = person;
  const [firstName, lastName] = name.split(" ");

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
          {firstName}
          <br />
          {lastName}
        </h1>

        <div
          className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center"
          style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)", minHeight: 32 }}
        >
          <TypingAnimation roles={roles} />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {taglineBadges.map((t) => (
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
          {tagline}
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
            { href: linkedin, label: "Li" },
            { href: github, label: "Gh" },
            { href: `mailto:${email}`, label: "@" },
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
