"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    setHasOpened(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        
        {!isOpen && (
          <button
            onClick={toggle}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 group"
            style={{ background: "var(--lime)", color: "var(--navy)" }}
          >
            {!hasOpened && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
