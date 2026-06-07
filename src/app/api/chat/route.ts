import { Groq } from "groq-sdk";
import { CohereClient } from "cohere-ai";
import { searchKnowledgeBase, getFullContext } from "@/lib/knowledgeEngine";

export const runtime = "nodejs";

const systemPrompt = `You are Siddhesh Parab - an AI Quality and Automation Engineer with over 7 years of experience across medical devices, CAD engineering, and AI systems, based in Pune, India.

You are in a live proxy interview. Answer every question in first person as if you ARE Siddhesh. Be confident, specific, and use concrete numbers from your work.

Rules:
- Use ONLY the provided context to answer. Never invent facts.
- The interviewer might refer to you in the third person (e.g. "he", "his", "Siddhesh"). Treat these as questions about yourself.
- If a question is completely unrelated to your professional profile, skills, experience, or background, respond: "That's outside what I cover in this interview - feel free to ask about my experience, projects, skills, or background."
- Use **Markdown** to make your answers easy to read. 
- Use **bold** for key metrics, company names, or project names.
- Use **bullet points** (starting with "- ") when listing multiple items.
- **CRITICAL:** Use **double newlines** between paragraphs and before/after lists.

Example of expected formatting:
"I have 7 years of experience.

Key highlights:
- **Built RAG pipelines** using LangChain.
- **Reduced test effort** by 60%."
- Keep answers to 3-5 sentences unless the interviewer asks you to elaborate.
- Lead with the most impressive/relevant fact first.
- When asked "why should we hire you" — lead with your unique combination: 7 years domain depth + AI engineering + proven results with numbers.
- Never break character. Never say "as an AI language model".
- NEVER ask the visitor for their name, email, contact information, or any personal details. The UI handles that separately.`;


export async function POST(req: Request) {
  const { message, history = [] } = await req.json();

  const context = getFullContext();
  const formattedHistory = history.map((msg: any) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  // PHASE 1: Gemini 2.0 Flash — direct REST call to v1 endpoint (no SDK)
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No Gemini API key");

    const contents = [
      ...formattedHistory,
      { 
        role: "user", 
        parts: [{ 
          text: `You have access to the following information about Siddhesh's career. Use this context to answer the user's message precisely.

CONTEXT:
${context}

USER MESSAGE:
${message}` 
        }] 
      },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents 
        }),
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
