# Project: Siddhesh Parab Portfolio (Next.js)

This project is a high-performance, AI-driven portfolio website for **Siddhesh Parab**, an AI Quality & Automation Engineer. It showcases his professional journey, projects, and skills, while featuring an interactive AI-powered interview proxy.

## Project Overview

- **Architecture:** Next.js 15+ (App Router) with TypeScript.
- **Content Management:** Notion acts as the primary CMS, managing everything from profile details to blog posts and lead captures.
- **AI Integration:** 
    - **Interactive Interview:** A multi-model AI proxy (`src/app/api/chat/route.ts`) that uses **Gemini 2.0 Flash** (primary), **Llama 3.3 (Groq)**, and **Command R (Cohere)** as fallbacks.
    - **RAG System:** A custom memory-based vector store (`src/lib/knowledgeEngine.ts`) using **Gemini Embeddings** to provide context-aware answers about Siddhesh's career.
- **UI/UX:** Styled with **Tailwind CSS 4** and custom CSS variables for a "Cream and Navy" theme. Features smooth animations via Framer Motion-like components (e.g., `RevealWrapper.tsx`).

## Building and Running

The project follows standard Next.js workflows. Ensure you have the required environment variables (see below) before running.

### Key Commands

- **Development:** `npm run dev` - Starts the development server at `http://localhost:3000`.
- **Production Build:** `npm run build` - Compiles the application for production.
- **Production Start:** `npm run start` - Runs the compiled production build.
- **Linting:** `npm run lint` - Runs ESLint to check for code quality and style issues.

### Required Environment Variables

A `.env.local` file is required with the following keys:
- `NOTION_API_KEY`: For CMS integration.
- `NOTION_PROFILE_DATABASE_ID`: Profile data.
- `NOTION_EXPERIENCE_DATABASE_ID`: Career history.
- `NOTION_PROJECTS_DATABASE_ID`: Project details.
- `NOTION_CERTS_DATABASE_ID`: Certifications.
- `NOTION_BLOG_DATABASE_ID`: Blog posts.
- `NOTION_LEADS_DB_ID`: Lead capture database.
- `GEMINI_API_KEY`: For Gemini 2.0 and Embeddings.
- `GROQ_API_KEY`: (Optional) Fallback for the interview proxy.
- `COHERE_API_KEY`: (Optional) Second fallback for the interview proxy.

## Development Conventions

- **Directory Structure:**
    - `src/app/`: App Router pages and API routes.
    - `src/components/`: Reusable React components.
    - `src/lib/`: Core logic (data fetching, RAG, shared definitions).
    - `public/`: Static assets (images, icons).
- **TypeScript:** Strict mode is enabled. Use interfaces from `src/lib/notion.ts` or `src/lib/data.ts` for type safety.
- **Path Aliases:** Use `@/*` to refer to the `src/` directory.
- **Data Fetching:** Prefer Server Components for data fetching from Notion to minimize client-side bundle size.
- **AI Charakter:** The AI proxy must always maintain the persona of Siddhesh Parab, answering in the first person based *only* on the provided context.
