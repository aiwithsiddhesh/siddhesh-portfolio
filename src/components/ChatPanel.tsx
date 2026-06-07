"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  toolsUsed?: string[];
}

export default function ChatPanel({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [leadPageId, setLeadPageId] = useState("");

  // Lead capture state
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore lead state from sessionStorage on mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem("lead_v2_dismissed") === "true";
    const submitted = sessionStorage.getItem("lead_v2_submitted") === "true";
    setLeadDismissed(dismissed);
    setLeadSubmitted(submitted);

    // Initialize or restore session ID
    let sid = sessionStorage.getItem("chat_session_id");
    if (!sid) {
      sid = `sid_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      sessionStorage.setItem("chat_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showLeadCard]);

  // Show lead card after first bot reply, once per session
  useEffect(() => {
    const hasFirstBotReply = messages.some(m => m.role === "assistant");
    const alreadySeen = leadDismissed || leadSubmitted;
    if (hasFirstBotReply && !alreadySeen) {
      setShowLeadCard(true);
    }
  }, [messages, leadDismissed, leadSubmitted]);

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setShowLeadCard(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // If this is the FIRST user message, create a lead record in Notion immediately
    if (newMessages.length === 1 && !leadPageId) {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: "Anonymous Visitor", 
          firstQuestion: text 
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) setLeadPageId(data.id);
      })
      .catch(err => console.error("Auto-lead error:", err));
    }

    // Log user message to Notion
    fetch("/api/chat-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, role: "user", content: text }),
    })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json();
        console.error("NOTION LOG ERROR (User Msg):", errorData);
      }
    })
    .catch(err => console.error("Log error:", err));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });

      const data = await response.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply,
        provider: data.provider,
        toolsUsed: data.toolsUsed,
      };
      setMessages([...newMessages, assistantMsg]);

      // Log assistant message to Notion
      fetch("/api/chat-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId, 
          role: "assistant", 
          content: data.reply, 
          provider: data.provider 
        }),
      })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          console.error("NOTION LOG ERROR (Bot Msg):", errorData);
        }
      })
      .catch(err => console.error("Log error:", err));
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
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
          pageId: leadPageId, // Update existing record
          name: leadName,
          email: leadEmail,
          company: leadCompany,
        }),
      });
    } catch (err) {
      console.error("Lead submit error:", err);
    } finally {
      setLeadLoading(false);
      setLeadSubmitted(true);
      setShowLeadCard(false);
      sessionStorage.setItem("lead_v2_submitted", "true");
    }
  };

  const handleLeadDismiss = () => {
    setLeadDismissed(true);
    setShowLeadCard(false);
    sessionStorage.setItem("lead_v2_dismissed", "true");
  };

  const starterChips = [
    "Walk me through your AI experience",
    "What's your most impactful project?",
    "Why should we hire you?",
  ];

  if (isOpen !== undefined && !isOpen) return null;

  return (
    <div className={`flex flex-col overflow-hidden bg-white ${isOpen !== undefined ? "w-full sm:w-[380px] h-[100dvh] sm:h-[540px] fixed sm:absolute sm:bottom-[80px] sm:right-0 sm:rounded-2xl shadow-2xl sm:border border-gray-200 z-50" : "w-full h-full relative"}`}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0" style={{ background: "var(--navy)", color: "var(--cream)" }}>
        <h2 className="font-bold uppercase tracking-wider text-lg" style={{ fontFamily: "var(--font-oswald, sans-serif)" }}>
          Chat with Siddhesh
        </h2>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear chat"
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
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-xl font-bold" style={{ color: "var(--lime)" }}>
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-end pb-4 space-y-2">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-left p-3 rounded-xl border transition-colors hover:bg-gray-100 text-sm font-medium"
                style={{ borderColor: "var(--lime)", color: "var(--navy)" }}
              >
                {chip}
              </button>
            ))}
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.role === "assistant" && (
                  <span className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--lime)" }}>
                    Siddhesh
                  </span>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed markdown-content ${
                    msg.role === "user"
                      ? "rounded-tr-sm font-medium shadow-sm"
                      : "bg-white border border-gray-100 rounded-tl-sm shadow-sm"
                  }`}
                  style={msg.role === "user" ? { background: "var(--cream)", color: "var(--navy)" } : { color: "#333" }}
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-4 last:mb-0 block">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2 block">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2 block">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-black text-black inline">{children}</strong>,
                      b: ({ children }) => <b className="font-black text-black inline">{children}</b>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-1 px-1">
                    {msg.provider && msg.provider !== "none" && (
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        via {msg.provider}
                      </span>
                    )}
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                        looked up: {msg.toolsUsed.map(t => t.replace("search_", "").replace("get_", "")).join(", ")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Lead Capture Card */}
            {showLeadCard && (
              <div
                className="rounded-2xl border-2 p-4 space-y-3 shadow-sm animate-fadeIn"
                style={{ borderColor: "var(--lime)", background: "#f9fef0" }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--navy)" }}>
                    Want Siddhesh to follow up? 👋
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    All fields are optional. Siddhesh will personally review this and may reach out.
                  </p>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--lime)" } as any}
                  />
                  <input
                    type="text"
                    placeholder="Email or LinkedIn URL"
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--lime)" } as any}
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={leadCompany}
                    onChange={e => setLeadCompany(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--lime)" } as any}
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={leadLoading || (!leadName && !leadEmail && !leadCompany)}
                      className="flex-1 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                      style={{ background: "var(--navy)", color: "var(--lime)" }}
                    >
                      {leadLoading ? "Sending..." : "Send"}
                    </button>
                    <button
                      type="button"
                      onClick={handleLeadDismiss}
                      className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-all"
                    >
                      Maybe later
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Thank you message after submit */}
            {leadSubmitted && messages.some(m => m.role === "assistant") && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-400 font-medium">
                  ✅ Thanks! Siddhesh will personally review this and may reach out.
                </span>
              </div>
            )}
          </>
        )}

        {isLoading && (
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--lime)" }}>
              Siddhesh
            </span>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ "--tw-ring-color": "var(--lime)" } as any}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 shrink-0"
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
