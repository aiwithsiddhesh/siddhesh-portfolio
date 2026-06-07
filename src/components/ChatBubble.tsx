"use client";

import { useState, useEffect } from "react";
import ChatPanel from "./ChatPanel";

export type ChatSize = "closed" | "popup" | "fullscreen";

export default function ChatBubble() {
  const [size, setSize]           = useState<ChatSize>("closed");
  const [isExiting, setIsExiting] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock scroll only in fullscreen
  useEffect(() => {
    document.body.style.overflow = size === "fullscreen" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [size]);

  const open = () => {
    setSize("popup");
    setIsExiting(false);
    setHasOpened(true);
  };

  const expand = () => {
    setSize("fullscreen");
    setIsExiting(false);
  };

  const collapse = () => {
    setSize("popup");
    setIsExiting(false);
  };

  const close = () => {
    if (size === "fullscreen") {
      // animate out then go to closed
      setIsExiting(true);
      setTimeout(() => {
        setSize("closed");
        setIsExiting(false);
      }, 220);
    } else {
      setSize("closed");
    }
  };

  if (!mounted) return null;

  const isOpen = size !== "closed";

  return (
    <>
      {/* ── Fullscreen backdrop (only in fullscreen) ── */}
      {(size === "fullscreen" || (isExiting && size === "closed")) && (
        <div
          className={`fixed inset-0 z-[99] ${isExiting ? "chat-backdrop-exit" : "chat-backdrop-enter"}`}
          style={{ background: "rgba(22,26,40,0.7)", backdropFilter: "blur(6px)" }}
          onClick={close}
        />
      )}

      {/* ── Chat panel ── */}
      {(isOpen || isExiting) && (
        <div
          className={`fixed z-[100] transition-all ${
            size === "fullscreen" || isExiting
              ? `inset-x-0 bottom-0 flex justify-center ${isExiting ? "chat-panel-exit" : "chat-panel-enter"}`
              : "bottom-24 right-6"
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div
            className={`bg-white overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
              size === "fullscreen" || isExiting
                ? "w-full md:max-w-lg md:mb-6 md:rounded-3xl rounded-t-3xl"
                : "w-[360px] sm:w-[400px] rounded-2xl border border-gray-200"
            }`}
            style={{
              height: size === "fullscreen" || isExiting ? "92dvh" : "540px",
            }}
          >
            <ChatPanel
              size={size}
              onClose={close}
              onExpand={expand}
              onCollapse={collapse}
            />
          </div>
        </div>
      )}

      {/* ── Floating bubble ── */}
      {!isOpen && !isExiting && (
        <button
          onClick={open}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center chat-bubble-glow transition-transform hover:scale-110 active:scale-95"
          style={{ background: "var(--lime)", color: "var(--navy)" }}
          aria-label="Open chat"
        >
          {!hasOpened && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </>
  );
}
