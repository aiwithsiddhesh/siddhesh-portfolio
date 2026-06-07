"use client";

import { useState, useEffect } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatBubble() {
  const [isOpen, setIsOpen]     = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
    setIsExiting(false);
    setHasOpened(true);
  };

  const close = () => {
    setIsExiting(true);
    // Wait for exit animation to finish before unmounting
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
    }, 220);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Fullscreen overlay */}
      {(isOpen || isExiting) && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-[99] ${isExiting ? "chat-backdrop-exit" : "chat-backdrop-enter"}`}
            style={{ background: "rgba(22,26,40,0.7)", backdropFilter: "blur(6px)" }}
            onClick={close}
          />

          {/* Panel */}
          <div
            className={`fixed inset-x-0 bottom-0 z-[100] flex justify-center ${isExiting ? "chat-panel-exit" : "chat-panel-enter"}`}
          >
            <div className="w-full md:max-w-lg md:mb-6 md:rounded-3xl overflow-hidden shadow-2xl"
              style={{ height: "92dvh" }}
              onClick={e => e.stopPropagation()}
            >
              <ChatPanel onClose={close} />
            </div>
          </div>
        </>
      )}

      {/* Floating bubble button */}
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
