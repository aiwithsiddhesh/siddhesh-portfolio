import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

interface Document {
  pageContent: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

import { person, experience, projects, education, skills, certifications, achievements } from "./data";

// Custom simple Memory Vector Store
class SimpleMemoryStore {
  docs: Document[] = [];
  embeddingsModel: GoogleGenerativeAIEmbeddings;

  constructor(embeddingsModel: GoogleGenerativeAIEmbeddings) {
    this.embeddingsModel = embeddingsModel;
  }

  async addDocuments(documents: Document[]) {
    // We embed them one by one or in a batch if the API allows.
    // For simplicity and to avoid rate limits, we will do it sequentially since there are <20 docs.
    const texts = documents.map(d => d.pageContent);
    const embeddings = await this.embeddingsModel.embedDocuments(texts);
    
    for (let i = 0; i < documents.length; i++) {
      documents[i].embedding = embeddings[i];
      this.docs.push(documents[i]);
    }
  }

  cosineSimilarity(a: number[], b: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async similaritySearch(query: string, k: number = 3, filter?: (doc: Document) => boolean) {
    const queryEmbedding = await this.embeddingsModel.embedQuery(query);
    
    let candidates = this.docs;
    if (filter) {
      candidates = candidates.filter(filter);
    }

    const scored = candidates.map(doc => ({
      doc,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding!)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(s => s.doc);
  }
}

// We use globalThis to persist the vector store across hot reloads in development
const globalForVectorStore = globalThis as unknown as {
  vectorStore: SimpleMemoryStore | undefined;
};

export async function getVectorStore(): Promise<SimpleMemoryStore> {
  if (globalForVectorStore.vectorStore) {
    return globalForVectorStore.vectorStore;
  }

  // Initialize embeddings model
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const docs: Document[] = [];

  // 1. Person Bio
  docs.push({
    pageContent: `My name is ${person.name}. I am an ${person.title} based in ${person.location}. ${person.bio} My email is ${person.email} and my phone number is ${person.phone}. I am open to roles like: ${person.openTo.join(", ")}.`,
    metadata: { category: "bio", title: "Personal Bio and Contact" },
  });

  // 2. Experience
  experience.forEach((job) => {
    const text = `I worked as a ${job.title} at ${job.company} from ${job.period}. Location: ${job.location}. Summary: ${job.summary}. Key responsibilities and achievements: ${job.bullets.join(" ")}. Technologies used: ${job.stack.join(", ")}.`;
    docs.push({
      pageContent: text,
      metadata: { category: "experience", title: `${job.title} at ${job.company}` },
    });
  });

  // 3. Projects
  projects.forEach((proj) => {
    const text = `I built a project called ${proj.title}. It is a ${proj.type}. Description: ${proj.desc}. Key outcomes: ${proj.outcomes.join(" ")}. Tech stack used: ${proj.stack.join(", ")}.`;
    docs.push({
      pageContent: text,
      metadata: { category: "projects", title: proj.title },
    });
  });

  // 4. Education
  education.forEach((edu) => {
    const text = `I studied ${edu.degree} at ${edu.school} in ${edu.location} from ${edu.period}. Highlights: ${edu.highlights.join(" ")}.`;
    docs.push({
      pageContent: text,
      metadata: { category: "education", title: edu.degree },
    });
  });

  // 5. Skills
  skills.forEach((skillGroup) => {
    const skillNames = skillGroup.items.map((i) => i.name).join(", ");
    const text = `In the category of ${skillGroup.category}, my skills include: ${skillNames}.`;
    docs.push({
      pageContent: text,
      metadata: { category: "skills", title: skillGroup.category },
    });
  });

  // 6. Certifications
  const certList = certifications.map((c) => `${c.title} from ${c.issuer} (${c.year})`).join(", ");
  docs.push({
    pageContent: `My certifications include: ${certList}.`,
    metadata: { category: "certifications", title: "Certifications" },
  });

  // 7. Achievements
  const achList = achievements.map((a) => `In ${a.year}, under ${a.category}, I achieved: ${a.title} - ${a.desc}`).join(" ");
  docs.push({
    pageContent: `Here are my major achievements: ${achList}`,
    metadata: { category: "achievements", title: "Achievements" },
  });

  const vectorStore = new SimpleMemoryStore(embeddings);
  await vectorStore.addDocuments(docs);
  
  globalForVectorStore.vectorStore = vectorStore;
  
  return vectorStore;
}

// Search Functions mapped to Gemini Tools
export async function searchExperience(query: string = "general experience") {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, 3, (doc: any) => doc.metadata.category === "experience");
  return results.map((r: any) => r.pageContent).join("\n\n");
}

export async function searchProjects(query: string = "all projects") {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, 3, (doc: any) => doc.metadata.category === "projects");
  return results.map((r: any) => r.pageContent).join("\n\n");
}

export async function searchSkills(query: string = "skills") {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, 3, (doc: any) => doc.metadata.category === "skills");
  return results.map((r: any) => r.pageContent).join("\n\n");
}

export async function getCertifications() {
  const store = await getVectorStore();
  const results = await store.similaritySearch("certifications", 1, (doc: any) => doc.metadata.category === "certifications");
  return results.map((r: any) => r.pageContent).join("\n\n");
}

export async function getBio() {
  const store = await getVectorStore();
  const results = await store.similaritySearch("bio", 1, (doc: any) => doc.metadata.category === "bio");
  return results.map((r: any) => r.pageContent).join("\n\n");
}

export async function getAchievements() {
  const store = await getVectorStore();
  const results = await store.similaritySearch("achievements", 1, (doc: any) => doc.metadata.category === "achievements");
  return results.map((r: any) => r.pageContent).join("\n\n");
}

// Used for Plain RAG (Groq and Cohere Fallbacks)
export async function searchKnowledgeBase(query: string) {
  try {
    const store = await getVectorStore();
    // Get top 5 across all categories for full context
    const results = await store.similaritySearch(query, 5);
    return results.map((r: any) => r.pageContent).join("\n\n");
  } catch (error) {
    console.error("Vector search failed (likely API limit), falling back to full context:", error);
    return getFullContext();
  }
}

export function getFullContext() {
  const allDocs = [];
  allDocs.push(`My name is ${person.name}. I am an ${person.title} based in ${person.location}. ${person.bio} My email is ${person.email} and my phone number is ${person.phone}. I am open to roles like: ${person.openTo.join(", ")}.`);
  
  experience.forEach((job) => {
    allDocs.push(`I worked as a ${job.title} at ${job.company} from ${job.period}. Location: ${job.location}. Summary: ${job.summary}. Key responsibilities and achievements: ${job.bullets.join(" ")}. Technologies used: ${job.stack.join(", ")}.`);
  });
  
  projects.forEach((proj) => {
    allDocs.push(`I built a project called ${proj.title}. It is a ${proj.type}. Description: ${proj.desc}. Key outcomes: ${proj.outcomes.join(" ")}. Tech stack used: ${proj.stack.join(", ")}.`);
  });
  
  education.forEach((edu) => {
    allDocs.push(`I studied ${edu.degree} at ${edu.school} in ${edu.location} from ${edu.period}. Highlights: ${edu.highlights.join(" ")}.`);
  });
  
  skills.forEach((skillGroup) => {
    const skillNames = skillGroup.items.map((i) => i.name).join(", ");
    allDocs.push(`In the category of ${skillGroup.category}, my skills include: ${skillNames}.`);
  });
  
  return allDocs.join("\n\n");
}
