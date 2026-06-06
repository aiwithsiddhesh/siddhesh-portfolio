"use client";
import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import RevealWrapper from "@/components/RevealWrapper";
import { person } from "@/lib/data";

const contactItems = [
  { icon: "✉️", label: "Email", value: person.email, href: `mailto:${person.email}` },
  { icon: "📞", label: "Phone", value: person.phone, href: `tel:${person.phone}` },
  { icon: "📍", label: "Location", value: person.location, href: null },
  { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/parab-siddhesh", href: person.linkedin },
  { icon: "⚙️", label: "GitHub", value: "github.com/qa-kit-cli", href: person.github },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <div className="pt-20">
      <section
        className="py-24"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(188,224,0,0.4) 0%, var(--cream) 60%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <RevealWrapper>
            <SectionHeader tag="Contact" title="Let's Build<br/>Something." />
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <RevealWrapper>
              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl shrink-0"
                      style={{ background: "var(--lime)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#718096" }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener"
                          className="text-sm font-semibold transition-colors duration-200 hover:text-[#bce000]"
                          style={{ color: "var(--navy)" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RevealWrapper>

            {/* Form */}
            <RevealWrapper delay={100}>
              <div
                className="p-8 rounded-2xl"
                style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
              >
                {status === "sent" ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h3
                      className="text-2xl font-black uppercase mb-2"
                      style={{ fontFamily: "var(--font-oswald, sans-serif)", color: "var(--navy)" }}
                    >
                      Message Sent!
                    </h3>
                    <p style={{ color: "#4a5568" }}>I&apos;ll get back to you shortly.</p>
                  </div>
                ) : (
                  <form
                    action="https://formspree.io/f/YOUR_FORM_ID"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {[
                      { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                      { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                      { id: "subject", label: "Subject", type: "text", placeholder: "What's this about?" },
                    ].map((f) => (
                      <div key={f.id}>
                        <label
                          htmlFor={f.id}
                          className="block text-xs font-bold uppercase tracking-widest mb-2"
                          style={{ color: "var(--navy)" }}
                        >
                          {f.label}
                        </label>
                        <input
                          id={f.id}
                          name={f.id}
                          type={f.type}
                          placeholder={f.placeholder}
                          required={f.id !== "subject"}
                          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                          style={{
                            border: "2px solid rgba(22,26,40,0.1)",
                            background: "#fff",
                            color: "var(--navy)",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--lime)")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(22,26,40,0.1)")}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-bold uppercase tracking-widest mb-2"
                        style={{ color: "var(--navy)" }}
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell me what you're building..."
                        required
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-vertical"
                        style={{
                          border: "2px solid rgba(22,26,40,0.1)",
                          background: "#fff",
                          color: "var(--navy)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--lime)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(22,26,40,0.1)")}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                      style={{ background: "var(--lime)", color: "var(--navy)" }}
                    >
                      {status === "sending" ? "Sending..." : status === "error" ? "Error — try email directly" : "→ Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>
    </div>
  );
}
