import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { getProfile } from "@/lib/notion";

export const metadata = { title: "About — Siddhesh Parab" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const person = await getProfile();

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-center">
        <h1 className="text-3xl font-bold">Profile Data Missing</h1>
        <p className="mt-4 text-gray-400">Please check your Notion connection.</p>
      </div>
    );
  }

  const { bio, openTo, skillsStack } = person;

  return (
    <div className="pt-20">
      {/* Hero banner */}
      <section className="py-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader tag="About Me" title="Problem-first.<br/>AI-powered." dark />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <RevealWrapper>
              <div
                className="rounded-2xl overflow-hidden border-4"
                style={{ borderColor: "var(--lime)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
              >
                <Image
                  src="/profile.jpg"
                  alt="Siddhesh Parab"
                  width={600}
                  height={700}
                  className="w-full object-cover"
                  style={{ animation: "float 6s ease-in-out infinite" }}
                />
              </div>
            </RevealWrapper>

            <RevealWrapper delay={100}>
              <p className="text-lg leading-relaxed mb-6 font-medium" style={{ color: "#e2e8f0" }}>
                {bio}
              </p>

              <div className="rounded-xl p-6 mb-4" style={{ background: "var(--navy-light)" }}>
                <h4 className="font-black uppercase text-base mb-2" style={{ color: "var(--lime)", fontFamily: "var(--font-oswald, sans-serif)" }}>
                  My Edge
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#cbd5e0" }}>
                  I come from environments where a missed defect has real consequences — patient-safety-critical codebases at Align Technology. That standard is what I bring to every AI workflow I build.
                </p>
              </div>

              <div className="rounded-xl p-6 mb-6" style={{ background: "var(--navy-light)" }}>
                <h4 className="font-black uppercase text-base mb-3" style={{ color: "var(--lime)", fontFamily: "var(--font-oswald, sans-serif)" }}>
                  Open To
                </h4>
                <div className="flex flex-wrap gap-2">
                  {openTo.map((r) => (
                    <span key={r} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--lime)", color: "var(--navy)" }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { href: "/experience", label: "Experience" },
                  { href: "/projects", label: "Projects" },
                  { href: "/skills", label: "Skills" },
                  { href: "/contact", label: "Contact Me" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 hover:bg-[#bce000] hover:text-[#161A28]"
                    style={{ background: "var(--navy-light)", color: "#fff" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* Stack section */}
      <section className="py-20" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Tools I Deploy" title="The Stack." />
          </RevealWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skillsStack.map((t) => (
              <RevealWrapper key={t}>
                <div
                  className="p-4 rounded-xl text-center text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "#fff", color: "var(--navy)", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
                >
                  {t}
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
