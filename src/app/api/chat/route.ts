import { Groq } from "groq-sdk";
import { CohereClient } from "cohere-ai";
import { searchKnowledgeBase, getFullContext } from "@/lib/knowledgeEngine";

export const runtime = "nodejs";

const systemPrompt = `You are Siddhesh Parab — an AI Quality & Automation Engineer with 7+ years of experience across medical devices, CAD engineering, and AI systems, based in Pune, India.

You are in a live proxy interview. Answer every question in first person as if you ARE Siddhesh. Be confident, specific, and use concrete numbers from your work.

Rules:
- Use ONLY the provided context to answer. Never invent facts.
- The interviewer might refer to you in the third person (e.g. "he", "his", "Siddhesh"). Treat these as questions about yourself.
- If a question is completely unrelated to your professional profile, skills, experience, or background, respond: "That's outside what I cover in this interview — feel free to ask about my experience, projects, skills, or background."
- Use **Markdown** to make your answers easy to read. 
- Use **bold** for key metrics, company names, or project names.
- Use **bullet points** (starting with `- `) when listing multiple items, achievements, or technologies.
- **CRITICAL:** Use **double newlines** between paragraphs or before/after lists to ensure proper spacing.
- Keep answers to 3-5 sentences unless the interviewer asks you to elaborate.
- Lead with the most impressive/relevant fact first.
- When asked "why should we hire you" — lead with your unique combination: 7 years domain depth + AI engineering + proven results with numbers.
- Never break character. Never say "as an AI language model".
- NEVER ask the visitor for their name, email, contact information, or any personal details. The UI handles that separately.`;


export async function POST(req: Request) {
  const { message, history = [] } = await req.json();

  // PHASE 1: Gemini 1.5 Flash — direct REST call to v1 endpoint (no SDK)
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No Gemini API key");

    const context = getFullContext();
    const augmentedMessage = `[MY PORTFOLIO CONTEXT — USE THIS TO ANSWER]\n${context}\n\n[INTERVIEWER QUESTION]\n${message}`;

    // Embed system prompt as first turns (v1beta doesn't support system_instruction field this way)
    const contents = [
      { role: "user", parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}\n\nAcknowledge these instructions briefly.` }] },
      { role: "model", parts: [{ text: "Understood. I am Siddhesh Parab, ready for the interview." }] },
      ...history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: augmentedMessage }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini ${res.status}: ${err}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Empty Gemini response");

    return Response.json({ reply, provider: "gemini", toolsUsed: [] });
  } catch (error) {
    console.error("Gemini failed, falling back to Groq:", error);
  }

  // PHASE 2: Groq Llama 3.3 70B
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const context = await searchKnowledgeBase(message);
    const groqHistory = history.map((msg: any) => ({ role: msg.role, content: msg.content }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `${systemPrompt}\n\n[CONTEXT]\n${context}` },
        ...groqHistory,
        { role: "user", content: message },
      ],
    });

    return Response.json({
      reply: completion.choices[0]?.message?.content || "No response generated.",
      provider: "groq",
      toolsUsed: [],
    });
  } catch (error) {
    console.error("Groq failed, falling back to Cohere:", error);
  }

  // PHASE 3: Cohere Command R
  try {
    const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });
    const context = await searchKnowledgeBase(message);
    const cohereHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "USER" : "CHATBOT",
      message: msg.content,
    }));

    const response = await cohere.chat({
      message,
      preamble: systemPrompt,
      chatHistory: cohereHistory,
      documents: [{ text: context }],
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
