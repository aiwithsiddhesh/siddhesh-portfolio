export const person = {
  name: "Siddhesh Parab",
  initials: "SP",
  title: "AI Quality & Automation Engineer",
  tagline:
    "I walk into teams, find where manual or broken processes are bleeding time, and ship AI automation that fixes them.",
  bio: "Most engineers can build AI systems. Most consultants can diagnose business problems. I do both — and that combination is rare. Over 7 years across medical devices, CAD engineering, and AI systems, I've learned that the most expensive problems aren't technical. They're the ones nobody has named yet. I find them, frame them, and build the solution — fast.",
  location: "Pune, Maharashtra, India",
  email: "parab.ssp.siddhesh@gmail.com",
  phone: "+91 9325849500",
  linkedin: "https://www.linkedin.com/in/parab-siddhesh",
  github: "https://github.com/aiwithsiddhesh",
  openTo: [
    "Forward-Deployed Engineer",
    "AI Solutions Engineer",
    "Technical Solutions Consultant",
    "AI Implementation Specialist",
    "AI Testing Engineer",
  ],
  roles: [
    "AI Quality Engineer",
    "LLM Systems Builder",
    "Forward-Deployed AI Consultant",
    "Test Automation Architect",
    "AI Solutions Engineer",
  ],
  stats: [
    { value: 7, suffix: "+", label: "Years Experience" },
    { value: 60, suffix: "%", label: "Test Effort Reduced" },
    { value: 30, suffix: "%", label: "Re-test Cycles Cut" },
    { value: 7, suffix: "", label: "Certifications" },
  ],
};

export const experience = [
  {
    title: "AI Quality Automation Specialist",
    company: "Freelance",
    badge: "Current",
    period: "Sep 2025 – Present",
    location: "India (Remote)",
    summary:
      "Diagnose broken processes in AI-first teams and ship working solutions fast across RAG pipelines, test automation, and CI workflows.",
    bullets: [
      "Built qa-kit — AI-assisted QA automation platform expanded into a reusable CLI framework on PyPI with templates, presets, CI integrations, and suite-based artifact management.",
      "RAG PIPELINE — Built LangChain + Claude API validation framework to measure retrieval accuracy, answer grounding, and response quality end-to-end. Replaced subjective review with measurable release gates.",
      "TEST GENERATION — Built OpenAI API-powered tool to auto-generate structured tests from requirements. Reduced test authoring effort by ~60%.",
      "CI TRIAGE — Deployed Claude API-based agent to cluster failure patterns and surface ranked root-cause hypotheses. Reduced re-test cycles by ~30%.",
      "CONSULTING — Advised early-stage teams on AI-first quality strategy, translating product requirements into evaluation frameworks and stakeholder-ready reporting.",
    ],
    stack: ["OpenAI API", "Claude API", "LangChain", "RAG", "Python", "Pytest", "Playwright", "CI/CD"],
  },
  {
    title: "Sr. SQA Engineer",
    company: "Align Technology",
    badge: "2 yrs 8 mos",
    period: "Feb 2023 – Sep 2025",
    location: "Pune",
    summary:
      "Led test automation and feature delivery for medical-grade CAD validation workflows — 3D-printed patient aligners where geometry accuracy is a patient-safety requirement.",
    bullets: [
      "Deployed LLM-based log parsing to surface re-test candidates automatically — reduced unnecessary re-test cycles by ~30%.",
      "Built AI agent workflow to auto-generate test cases from requirements. Cut manual authoring effort by ~60%.",
      "Spearheaded Python-based tooling for geometry compliance, mesh validation, and data import — 70%+ automation coverage across key CAD workflows.",
      "Owned feature delivery end-to-end: ticket management, test matrices, and stakeholder-facing metrics across every release.",
      "Mentored SDET team in automation best practices under Agile, driving consistency across cross-functional delivery.",
    ],
    stack: ["Python", "Pytest", "GitHub Actions", "CI/CD", "LLM Log Analysis", "AI Test Generation"],
  },
  {
    title: "Senior Engineer",
    company: "Tata Technologies",
    badge: "1 yr 1 mo",
    period: "Feb 2022 – Feb 2023",
    location: "Pune",
    summary:
      "Worked closely within CAD software teams supporting automotive OEM clients including Jaguar Land Rover, bridging design domain knowledge with technical delivery.",
    bullets: [
      "Diagnosed functional gaps in Hide/Show Geometry module and performed manual verification of plastic features against OEM specs.",
      "Bridged SDET-domain gap: provided design input for test case development, defect prioritisation, and CAD edge cases automation was missing.",
      "Accelerated manual-to-automation transition by reviewing automation scripts and surfacing domain-specific edge cases.",
      "Participated in sprint planning and user story reviews under Agile, providing geometry-focused insights that improved test coverage.",
    ],
    stack: ["Internal CAD Tool", "Python", "Pytest"],
  },
  {
    title: "Design Quality Engineer",
    company: "Faurecia R&D Center",
    badge: "2 yrs",
    period: "Mar 2020 – Feb 2022",
    location: "Pune",
    summary:
      "Embedded within the product design team to diagnose quality bottlenecks in plastic part validation and build automation that eliminated them.",
    bullets: [
      "Developed internal web CAD automation tool covering wall thickness, draft angles, and parting line validation — reduced validation time by ~55%.",
      "Automated 300+ manual steps per release end-to-end — eliminated all manual steps for geometry compliance checks.",
      "Built batch pipeline processing 500+ parts per run, catching surface defects and tolerance violations before manufacturing handoff.",
      "Introduced pre-validation checks covering thin walls, undercuts, and surface discontinuities — reduced post-handoff defects by ~40%.",
      "Designed and maintained 80+ structured test cases with documented pass/fail criteria tied to engineering specs.",
    ],
    stack: ["Web CAD Application", "Python", "Automation Scripting", "Manual SQA"],
  },
];

export const projects = [
  {
    slug: "qa-kit",
    title: "qa-kit",
    type: "Open Source · CLI Tool",
    desc: "AI-assisted QA automation platform — standardizes planning, CI integration, traceability, regression validation, and release-gate workflows across engineering teams.",
    outcomes: [
      "Suite-based artifact management with templates and presets",
      "CI integration hooks for GitHub Actions and other pipelines",
      "Reusable framework expanded from org-specific need into a public package",
      "Published to PyPI — installable with pip install qa-kit-cli",
    ],
    stack: ["Python", "CLI", "CI/CD", "PyPI", "AI-assisted QA"],
    github: "https://github.com/aiwithsiddhesh/qa-kit",
    pypi: "https://pypi.org/project/qa-kit-cli/",
  },
  {
    slug: "rag-validation",
    title: "RAG Validation Pipeline",
    type: "AI Engineering · Client Project",
    desc: "Client had limited visibility into hallucinations reaching users. Built a measurable, end-to-end validation framework replacing subjective review with release gates.",
    outcomes: [
      "Measures retrieval accuracy, answer grounding, and response quality end-to-end",
      "Replaced 'just trust it' black box with quantified quality metrics",
      "Integrated as a release gate into client CI workflow",
    ],
    stack: ["LangChain", "Claude API", "RAG", "Python", "CI/CD"],
    github: null,
    pypi: null,
  },
  {
    slug: "ai-test-generator",
    title: "AI Test Case Generator",
    type: "AI Engineering · Internal Tool",
    desc: "Team was spending 60%+ of QA time manually writing test cases. Built an OpenAI API-powered tool to auto-generate structured tests from requirements documents.",
    outcomes: [
      "~60% reduction in test authoring effort",
      "Structured, traceable test cases generated directly from specs",
      "Deployed in both freelance and Align Technology contexts",
    ],
    stack: ["OpenAI API", "Python", "Pytest", "Prompt Engineering"],
    github: null,
    pypi: null,
  },
];

export const education = [
  {
    degree: "B.E. Mechanical Engineering",
    school: "KIT's College of Engineering (Autonomous), Kolhapur",
    period: "July 2012 – June 2016",
    location: "Kolhapur, Maharashtra",
    highlights: [
      "Mechanical engineering grounding underpins deep CAD validation domain expertise",
      "Problem-solving and systems thinking applied directly across 7+ years in quality engineering",
      "Domain knowledge that neither pure engineers nor pure testers can replicate",
    ],
  },
];

export const skills = [
  {
    category: "AI & LLM Systems",
    icon: "🤖",
    items: [
      { name: "OpenAI API / Claude API", pct: 92 },
      { name: "LangChain & RAG Pipelines", pct: 88 },
      { name: "Prompt Engineering", pct: 90 },
      { name: "AI Agent Design", pct: 85 },
    ],
  },
  {
    category: "Test Automation",
    icon: "🧪",
    items: [
      { name: "Python / Pytest", pct: 90 },
      { name: "Playwright", pct: 82 },
      { name: "CI/CD Integration", pct: 85 },
      { name: "AI Test Generation", pct: 88 },
    ],
  },
  {
    category: "Dev & Tooling",
    icon: "⚙️",
    items: [
      { name: "GitHub Actions", pct: 83 },
      { name: "Python CLI Frameworks", pct: 85 },
      { name: "Vercel / Supabase", pct: 75 },
      { name: "Generative AI Tools", pct: 90 },
    ],
  },
  {
    category: "Domain Knowledge",
    icon: "🏭",
    items: [
      { name: "Medical Device QA", pct: 88 },
      { name: "CAD Validation", pct: 82 },
      { name: "Agile / SDLC", pct: 85 },
      { name: "SQA Strategy", pct: 87 },
    ],
  },
];

export const certifications = [
  {
    title: "Claude Code 101",
    issuer: "Anthropic",
    icon: "🤖",
    year: "Apr 2026",
    link: "https://verify.skilljar.com/c/92fof232988t",
  },
  {
    title: "Claude Code in Action",
    issuer: "Anthropic",
    icon: "⚡",
    year: "2026",
    link: "https://verify.skilljar.com/c/97ube7zrwvhv",
  },
  {
    title: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    icon: "🔗",
    year: "2026",
    link: "https://verify.skilljar.com/c/mrm9kbmd4wbd",
  },
  {
    title: "Introduction to Subagents",
    issuer: "Anthropic",
    icon: "🤝",
    year: "2026",
    link: "https://verify.skilljar.com/c/yovfr4sgze7c",
  },
  {
    title: "Introduction to Agent Skills",
    issuer: "Anthropic",
    icon: "🧠",
    year: "2026",
    link: "https://verify.skilljar.com/c/bk7ngdf2k6qr",
  },
  {
    title: "Spec-Driven Development with Coding Agents",
    issuer: "DeepLearning.AI × JetBrains",
    icon: "📐",
    year: "Jun 2026",
    link: "https://learn.deeplearning.ai/accomplishments/4e3ef5f0-5b7f-447f-9e80-0b6a53d6d05e",
  },
  {
    title: "Gemini CLI: Code & Create with an Open-Source Agent",
    issuer: "DeepLearning.AI",
    icon: "💎",
    year: "Jun 2026",
    link: "https://learn.deeplearning.ai/accomplishments/a9eaca4c-0bb1-47be-8f64-89ba48ed6bf3",
  },
];

export const achievements = [
  {
    year: "2026",
    category: "Open Source",
    title: "qa-kit — AI-Assisted QA CLI Framework",
    desc: "Published qa-kit-cli to PyPI — adopted across engineering teams for AI-assisted QA planning, CI integration, and release-gate workflows.",
  },
  {
    year: "2025",
    category: "AI Engineering",
    title: "LLM Log Analysis at Align Technology",
    desc: "Deployed Claude API-based agent to cluster test failure patterns — reduced unnecessary re-test cycles by ~30% across patient-safety-critical codebase.",
  },
  {
    year: "2025",
    category: "AI Engineering",
    title: "RAG Validation Framework",
    desc: "Built LangChain + Claude API pipeline replacing subjective review with measurable release gates for retrieval accuracy and answer grounding.",
  },
  {
    year: "2024",
    category: "Test Automation",
    title: "AI Test Generation — 60% Effort Reduction",
    desc: "Built OpenAI API-powered tool to auto-generate structured test cases from requirements documents, cutting manual authoring effort by ~60%.",
  },
  {
    year: "2023",
    category: "Automation",
    title: "70%+ CAD Automation Coverage",
    desc: "Spearheaded Python-based tooling for geometry compliance, mesh validation, and data import at Align Technology.",
  },
  {
    year: "2021",
    category: "Engineering",
    title: "CAD Validation Tool — 55% Faster",
    desc: "Developed internal web CAD automation tool at Faurecia R&D — reduced validation time by ~55% and eliminated 300+ manual steps per release.",
  },
];
