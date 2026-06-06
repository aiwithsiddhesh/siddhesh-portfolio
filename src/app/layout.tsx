import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Siddhesh Parab — AI Quality & Automation Engineer",
  description:
    "AI Quality & Automation Engineer building LLM systems, RAG pipelines, and test automation tools. OpenAI · Claude · LangChain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
