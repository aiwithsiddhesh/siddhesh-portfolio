import ChatPanel from "@/components/ChatPanel";

export const metadata = {
  title: "Interview Siddhesh",
  description: "Chat with an AI proxy of Siddhesh Parab to learn about his experience and projects.",
};

export default function ChatPage() {
  return (
    <section 
      className="flex flex-col items-center justify-center px-4 h-[100dvh]"
      style={{
        background: "radial-gradient(circle at top left, rgba(188,224,0,0.1) 0%, var(--cream) 100%)",
      }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center mb-8 text-center mt-20">
        <h1 
          className="font-black uppercase leading-none mb-2"
          style={{
            fontSize: "clamp(32px, 6vw, 64px)",
            color: "var(--navy)",
            fontFamily: "var(--font-oswald, sans-serif)",
          }}
        >
          Interview Siddhesh
        </h1>
        <p className="font-medium text-gray-600">
          Ask me anything about my experience, projects, or skills.
        </p>
      </div>

      <div className="w-full max-w-2xl h-[65vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
        <ChatPanel />
      </div>
    </section>
  );
}
