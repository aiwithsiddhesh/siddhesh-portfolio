"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

function getOrCreateSessionId(): string {
  let sid = sessionStorage.getItem("chat_session_id");
  if (!sid) {
    sid = `sid_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    sessionStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

function buildTranscript(msgs: Message[]): string {
  return msgs
    .map(m => `${m.role === "user" ? "Visitor" : "Siddhesh"}: ${m.content}`)
    .join("\n\n");
}

export default function ChatPanel({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);

  const [showLeadCard, setShowLeadCard]   = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName]     = useState("");
  const [leadEmail, setLeadEmail]   = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);

  const sessionIdRef  = useRef<string>("");
  const leadPageIdRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    setLeadDismissed(sessionStorage.getItem("lead_v2_dismissed") === "true");
    setLeadSubmitted(sessionStorage.getItem("lead_v2_submitted") === "true");
    // Auto-focus input on open
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showLeadCard]);

  useEffect(() => {
    const hasBotReply = messages.some(m => m.role === "assistant");
    if (hasBotReply && !leadDismissed && !leadSubmitted) setShowLeadCard(true);
  }, [messages, leadDismissed, leadSubmitted]);

  const updateLeadTranscript = (allMsgs: Message[]) => {
    const pid = leadPageIdRef.current;
    if (!pid) return;
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageId: pid,
        chatLog: buildTranscript(allMsgs),
        messageCount: allMsgs.length,
      }),
    }).catch(() => {});
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const sid = sessionIdRef.current;
    const newMsgs: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setIsLoading(true);

    if (newMsgs.length === 1 && !leadPageIdRef.current) {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Anonymous Visitor",
          firstQuestion: text,
          sessionId: sid,
          chatLog: buildTranscript(newMsgs),
          messageCount: 1,
        }),
      })
        .then(r => r.json())
        .then(d => { if (d.id) leadPageIdRef.current = d.id; })
        .catch(() => {});
    }

    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      const botMsg: Message = { role: "assistant", content: data.reply, provider: data.provider };
      const final = [...newMsgs, botMsg];
      setMessages(final);
      updateLeadTranscript(final);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Sorry, having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName && !leadEmail && !leadCompany) return;
    setLeadLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: leadPageIdRef.current,
          name: leadName || undefined,
          email: leadEmail || undefined,
          company: leadCompany || undefined,
          chatLog: buildTranscript(messages),
          messageCount: messages.length,
        }),
      });
    } catch {}
    setLeadLoading(false);
    setLeadSubmitted(true);
    setShowLeadCard(false);
    sessionStorage.setItem("lead_v2_submitted", "true");
  };

  const starterChips = [
    "Walk me through your AI experience",
    "What's your most impactful project?",
    "Why should we hire you?",
    "Can we schedule a call?",
  ];

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ background: "var(--navy)", color: "var(--cream)" }}
      >
        <div>
          <h2
            className="font-black uppercase tracking-wider text-xl leading-tight"
            style={{ fontFamily: "var(--font-oswald, sans-serif)" }}
          >
            Chat with Siddhesh
          </h2>
          <a
            href="https://calendly.com/parab-ssp-siddhesh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mt-0.5 hover:opacity-75 transition-opacity"
            style={{ color: "var(--lime)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book a Call
          </a>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setShowLeadCard(false); }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-xs font-semibold flex items-center gap-1"
              style={{ color: "var(--lime)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              style={{ color: "var(--lime)" }}
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24" style={{ background: "#f7f7f2" }}>

        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-end pb-2 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: "var(--navy)", opacity: 0.4 }}>
              Ask me anything
            </p>
            {starterChips.map((chip, i) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="chip-in text-left px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                style={{
                  borderColor: "var(--lime)",
                  color: "var(--navy)",
                  background: "#fff",
                  animationDelay: `${i * 60}ms`,
                  opacity: 0,
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === "user" ? "items-end msg-right" : "items-start msg-left"}`}
              >
                {msg.role === "assistant" && (
                  <span
                    className="text-[11px] font-black uppercase tracking-widest mb-1 px-1"
                    style={{ color: "var(--lime)" }}
                  >
                    Siddhesh
                  </span>
                )}
                <div
                  className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed markdown-content ${
                    msg.role === "user"
                      ? "rounded-3xl rounded-tr-sm shadow-sm font-medium"
                      : "rounded-3xl rounded-tl-sm shadow-sm bg-white border border-gray-100"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "var(--navy)", color: "var(--cream)" }
                      : { color: "#1a1a2e" }
                  }
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p:      ({ children }) => <p className="mb-3 last:mb-0 block">{children}</p>,
                      ul:     ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1 block">{children}</ul>,
                      ol:     ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1 block">{children}</ol>,
                      li:     ({ children }) => <li className="mb-0.5">{children}</li>,
                      strong: ({ children }) => <strong className="font-black inline" style={{ color: msg.role === "user" ? "var(--lime)" : "var(--navy)" }}>{children}</strong>,
                      a:      ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="underline font-bold" style={{ color: "var(--lime)" }}>
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.role === "assistant" && msg.provider && msg.provider !== "none" && (
                  <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 px-1">
                    via {msg.provider}
                  </span>
                )}
              </div>
            ))}

            {/* Lead card */}
            {showLeadCard && (
              <div
                className="lead-card-in rounded-3xl border-2 p-5 space-y-3 shadow-lg"
                style={{ borderColor: "var(--lime)", background: "#f5fde0", opacity: 0 }}
              >
                <div>
                  <p className="text-sm font-black uppercase tracking-wide" style={{ color: "var(--navy)" }}>
                    Want Siddhesh to follow up? 👋
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">All fields optional — he'll personally review this.</p>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  {[
                    { placeholder: "Your name", value: leadName, set: setLeadName, type: "text" },
                    { placeholder: "Email or LinkedIn URL", value: leadEmail, set: setLeadEmail, type: "text" },
                    { placeholder: "Company (optional)", value: leadCompany, set: setLeadCompany, type: "text" },
                  ].map(f => (
                    <input
                      key={f.placeholder}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": "var(--lime)" } as any}
                    />
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={leadLoading || (!leadName && !leadEmail && !leadCompany)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
                      style={{ background: "var(--navy)", color: "var(--lime)" }}
                    >
                      {leadLoading ? "Sending..." : "Send"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLeadDismissed(true); setShowLeadCard(false); sessionStorage.setItem("lead_v2_dismissed", "true"); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-all active:scale-95"
                    >
                      Maybe later
                    </button>
                  </div>
                </form>
              </div>
            )}

            {leadSubmitted && (
              <p className="text-center text-xs text-gray-400 font-semibold py-1">
                ✅ Thanks! Siddhesh will personally review and may reach out.
              </p>
            )}
          </>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex flex-col items-start msg-left">
            <span className="text-[11px] font-black uppercase tracking-widest mb-1 px-1" style={{ color: "var(--lime)" }}>
              Siddhesh
            </span>
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-3xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--lime)", animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-3 shrink-0 border-t border-gray-100"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}
      >
        <form
          onSubmit={e => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2 items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
            style={{ "--tw-ring-color": "var(--lime)" } as any}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-all disabled:opacity-40 hover:scale-105 active:scale-95 shrink-0"
            style={{ background: "var(--lime)", color: "var(--navy)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
