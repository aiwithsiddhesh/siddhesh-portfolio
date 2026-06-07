import { Groq } from "groq-sdk";
import { CohereClient } from "cohere-ai";
import { searchKnowledgeBase, getFullContext } from "@/lib/knowledgeEngine";

export const runtime = "nodejs";

const CALENDLY_URL = "https://calendly.com/parab-ssp-siddhesh";

const systemPrompt = `You are Siddhesh Parab in a live interview. Speak in first person, naturally and confidently — like a real person talking, not reading a resume.

Rules:
- Answer from the context provided. Never invent facts.
- If asked something unrelated to your professional background, say: "That's outside what I cover here — ask me about my experience, projects, or skills."
- Keep answers tight: 2-4 sentences for simple questions, a short paragraph + 2-3 bullets max for complex ones. Never list everything you've done.
- Lead with the most impressive fact first. Then support it with one specific example and a number.
- Sound like you're in a real conversation — confident, direct, no filler phrases like "Certainly!" or "Great question!".
- Never say "as an AI". Never ask for the visitor's contact info.
- Use **bold** only for key numbers or company names. Use bullet points only when listing 3+ distinct items.
- If the visitor asks to schedule a call, book a meeting, set up a demo, or wants to talk live — share this link: ${CALENDLY_URL}`;

// Gemini models tried in order — if one hits quota the next is attempted
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

async function tryGemini(apiKey: string, contents: any[]): Promise<string | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
          }),
        }
      );

      if (res.status === 429) {
        console.warn(`Gemini ${model} quota exhausted, trying next model`);
        continue;
      }

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Gemini ${model} error ${res.status}: ${err.slice(0, 100)}`);
        continue;
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) {
        console.warn(`Gemini ${model} returned empty response`);
        continue;
      }

      console.log(`Gemini success with model: ${model}`);
      return reply;
    } catch (err) {
      console.warn(`Gemini ${model} threw:`, err);
    }
  }
  return null;
}

export async function POST(req: Request) {
  const { message, history = [] } = await req.json();

  const context = getFullContext();

  // Build Gemini contents: history (clean, no context injection) + current message with context
  // Context is injected only once in the current user turn, not repeated in history
  const formattedHistory = history.map((msg: any) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const contents = [
    ...formattedHistory,
    {
      role: "user",
      parts: [{
        text: `[Background on Siddhesh — use this to answer, do not repeat it verbatim]\n${context}\n\n[Question]\n${message}`,
      }],
    },
  ];

  // PHASE 1: Gemini — tries multiple models before giving up
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const reply = await tryGemini(apiKey, contents);
    if (reply) {
      return Response.json({ reply, provider: "Gemini", toolsUsed: [] });
    }
    console.error("All Gemini models failed, falling back to Groq");
  }

  // PHASE 2: Groq — context injected once in system, clean history
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const ragContext = await searchKnowledgeBase(message);
    const groqHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `${systemPrompt}\n\n[Background — use to answer, do not repeat verbatim]\n${ragContext}` },
        ...groqHistory,
        { role: "user", content: message },
      ],
    });

    return Response.json({
      reply: completion.choices[0]?.message?.content || "No response generated.",
      provider: "Groq",
      toolsUsed: [],
    });
  } catch (error) {
    console.error("Groq failed, falling back to Cohere:", error);
  }

  // PHASE 3: Cohere Command R
  try {
    const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });
    const ragContext = await searchKnowledgeBase(message);
    const cohereHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "USER" : "CHATBOT",
      message: msg.content,
    }));

    const response = await cohere.chat({
      message,
      preamble: systemPrompt,
      chatHistory: cohereHistory,
      documents: [{ text: ragContext }],
    });

    return Response.json({ reply: response.text, provider: "cohere", toolsUsed: [] });
  } catch (error) {
    console.error("Cohere failed:", error);
  }

  return Response.json({
    reply: "I'm having trouble connecting right now. Please email parab.ssp.siddhesh@gmail.com or connect on LinkedIn.",
    provider: "none",
    toolsUsed: [],
  });
}
