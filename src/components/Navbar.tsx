"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { person } from "@/lib/data";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/education", label: "Education" },
  { href: "/skills", label: "Skills" },
  { href: "/wins", label: "Wins" },
  { href: "/certifications", label: "Certs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(251,251,234,0.98)"
          : "rgba(251,251,234,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(22,26,40,0.05)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-black text-2xl tracking-widest uppercase"
          style={{ color: "var(--navy)", fontFamily: "sans-serif" }}
        >
          {person.initials}
        </Link>

        {/* Desktop */}
        <ul className="hidden lg:flex gap-1 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-3 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200"
                style={{
                  color: pathname === l.href ? "var(--lime)" : "var(--navy)",
                  background:
                    pathname === l.href ? "var(--navy)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--navy)",
              transform: open ? "translateY(8px) rotate(45deg)" : "",
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--navy)",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--navy)",
              transform: open ? "translateY(-8px) rotate(-45deg)" : "",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "600px" : "0" }}
      >
        <ul
          className="flex flex-col px-6 pb-4 gap-1 list-none"
          style={{ borderTop: "1px solid rgba(22,26,40,0.08)" }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200"
                style={{
                  color: pathname === l.href ? "var(--lime)" : "var(--navy)",
                  background:
                    pathname === l.href ? "var(--navy)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
