"use client";
import { useEffect, useRef } from "react";

export default function TypingAnimation({ roles }: { roles: string[] }) {
  const twRef = useRef<HTMLSpanElement>(null);
  const state = useRef({ roleIdx: 0, charIdx: 0, deleting: false });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function type() {
      const el = twRef.current;
      const s = state.current;
      if (!el || roles.length === 0) return;
      const current = roles[s.roleIdx];
      if (s.deleting) {
        el.textContent = current.substring(0, --s.charIdx);
        if (s.charIdx < 0) {
          s.deleting = false;
          s.roleIdx = (s.roleIdx + 1) % roles.length;
          timeout = setTimeout(type, 400);
          return;
        }
        timeout = setTimeout(type, 50);
      } else {
        el.textContent = current.substring(0, ++s.charIdx);
        if (s.charIdx > current.length) {
          s.deleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
        timeout = setTimeout(type, 100);
      }
    }
    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, [roles]);

  return (
    <>
      <span ref={twRef} />
      <span className="tw-cursor" />
    </>
  );
}
