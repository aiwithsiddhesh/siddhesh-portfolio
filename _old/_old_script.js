// ── DATA ──────────────────────────────────────────────────────────────────────

const skillsData = [
  {
    category: "AI & LLM Systems",
    icon: "🤖",
    skills: [
      { name: "OpenAI API / Claude API", pct: 92 },
      { name: "LangChain & RAG Pipelines", pct: 88 },
      { name: "Prompt Engineering", pct: 90 },
      { name: "AI Agent Design", pct: 85 },
    ]
  },
  {
    category: "Test Automation",
    icon: "🧪",
    skills: [
      { name: "Python / Pytest", pct: 90 },
      { name: "Playwright", pct: 82 },
      { name: "CI/CD Integration", pct: 85 },
      { name: "Test Generation (AI)", pct: 88 },
    ]
  },
  {
    category: "Dev & Tooling",
    icon: "⚙️",
    skills: [
      { name: "GitHub Actions", pct: 83 },
      { name: "Python CLI Frameworks", pct: 85 },
      { name: "Vercel / Supabase", pct: 75 },
      { name: "Generative AI Tools", pct: 90 },
    ]
  },
  {
    category: "Domain Knowledge",
    icon: "🏭",
    skills: [
      { name: "Medical Device QA", pct: 88 },
      { name: "CAD Validation", pct: 82 },
      { name: "Agile / SDLC", pct: 85 },
      { name: "SQA Strategy", pct: 87 },
    ]
  }
];

const certsData = [
  {
    title: "Claude Code 101",
    issuer: "Anthropic",
    icon: "🤖",
    year: "2026",
    link: null
  },
  {
    title: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    icon: "🔗",
    year: "2026",
    link: "https://verify.skilljar.com/c/mrm9kbmd4wbd"
  },
  {
    title: "Claude Code in Action",
    issuer: "Anthropic",
    icon: "⚡",
    year: "2026",
    link: "https://verify.skilljar.com/c/97ube7zrwvhv"
  },
  {
    title: "Introduction to Agent Skills",
    issuer: "Anthropic",
    icon: "🧠",
    year: "2026",
    link: null
  },
  {
    title: "Introduction to Subagents",
    issuer: "Anthropic",
    icon: "🤝",
    year: "2026",
    link: null
  },
  {
    title: "Spec-Driven Development with Coding Agents",
    issuer: "DeepLearning.AI × JetBrains",
    icon: "📐",
    year: "2026",
    link: "https://learn.deeplearning.ai/accomplishments/4e3ef5f0-5b7f-447f-9e80-0b6a53d6d05e"
  },
  {
    title: "Gemini CLI: Code & Create with an Open-Source Agent",
    issuer: "DeepLearning.AI",
    icon: "💎",
    year: "2026",
    link: "https://learn.deeplearning.ai/accomplishments/a9eaca4c-0bb1-47be-8f64-89ba48ed6bf3"
  }
];

const achievementsData = [
  {
    year: "2026",
    category: "Open Source",
    title: "qa-kit — AI-Assisted QA CLI Framework",
    desc: "Published qa-kit-cli to PyPI — a reusable CLI framework for AI-assisted QA planning, CI integration, traceability, and release-gate workflows adopted across engineering teams."
  },
  {
    year: "2025",
    category: "AI Engineering",
    title: "LLM Log Analysis at Align Technology",
    desc: "Deployed Claude API-based agent to cluster test failure patterns and surface ranked root-cause hypotheses — reduced unnecessary re-test cycles by ~30% across patient-safety-critical codebase."
  },
  {
    year: "2025",
    category: "AI Engineering",
    title: "RAG Validation Framework",
    desc: "Built LangChain + Claude API pipeline to measure retrieval accuracy, answer grounding, and response quality end-to-end — replaced subjective review with measurable release gates."
  },
  {
    year: "2024",
    category: "Test Automation",
    title: "AI Test Generation — 60% Effort Reduction",
    desc: "Built OpenAI API-powered tool to auto-generate structured test cases from requirements documents, cutting manual authoring effort by ~60% for the QA team."
  },
  {
    year: "2023",
    category: "Automation",
    title: "70%+ CAD Automation Coverage",
    desc: "Spearheaded Python-based tooling for geometry compliance, mesh validation, and data import workflows at Align Technology — achieved 70%+ automation coverage across key CAD workflows."
  },
  {
    year: "2021",
    category: "Engineering",
    title: "CAD Validation Tool — 55% Faster",
    desc: "Developed internal web CAD automation tool at Faurecia R&D covering wall thickness, draft angles, and parting line validation — reduced validation time by ~55% and eliminated 300+ manual steps per release."
  }
];

// ── RENDER FUNCTIONS ───────────────────────────────────────────────────────────

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  grid.innerHTML = skillsData.map(cat => `
    <div class="skill-category reveal">
      <div class="skill-cat-title"><span>${cat.icon}</span> ${cat.category}</div>
      ${cat.skills.map(s => `
        <div class="skill-info">
          <span class="skill-name">${s.name}</span>
          <span class="skill-pct">${s.pct}%</span>
        </div>
        <div class="skill-bar"><div class="skill-fill" data-pct="${s.pct}"></div></div>
      `).join('')}
    </div>
  `).join('');
}

function renderCerts() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;
  grid.innerHTML = certsData.map(c => `
    <div class="cert-card reveal">
      <div class="cert-icon">${c.icon}</div>
      <div class="cert-info">
        <h4>${c.title}</h4>
        <p>${c.issuer} · ${c.year}</p>
        ${c.link ? `<a href="${c.link}" target="_blank" rel="noopener">View Certificate ↗</a>` : ''}
      </div>
    </div>
  `).join('');
}

function renderAchievements() {
  const list = document.getElementById('achievements-list');
  if (!list) return;
  list.innerHTML = achievementsData.map(a => `
    <div class="achievement-card reveal">
      <div class="achievement-year">${a.year}</div>
      <div>
        <span class="achievement-cat">${a.category}</span>
        <div class="achievement-title">${a.title}</div>
        <div class="achievement-desc">${a.desc}</div>
      </div>
    </div>
  `).join('');
}

// ── TYPEWRITER ─────────────────────────────────────────────────────────────────

const roles = [
  "AI Quality Engineer",
  "LLM Systems Builder",
  "Forward-Deployed AI Consultant",
  "Test Automation Architect",
  "AI Solutions Engineer"
];

let roleIdx = 0, charIdx = 0, deleting = false;

function typeWriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  const current = roles[roleIdx];
  if (deleting) {
    el.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeWriter, 400); return; }
    setTimeout(typeWriter, 50);
  } else {
    el.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(typeWriter, 2000); return; }
    setTimeout(typeWriter, 100);
  }
}

// ── STAT COUNTER ───────────────────────────────────────────────────────────────

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + suffix;
    if (count >= target) clearInterval(timer);
  }, 20);
}

// ── INTERSECTION OBSERVER ──────────────────────────────────────────────────────

function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      // animate skill bars
      el.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });

      // animate stat counters
      if (el.classList.contains('stat-card')) {
        const num = el.querySelector('.stat-number[data-target]');
        if (num && !num.dataset.counted) { num.dataset.counted = '1'; animateCounter(num); }
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // also watch skill-fill elements inside already-visible containers
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────────

function initNav() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // scroll spy
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ── CONTACT FORM ───────────────────────────────────────────────────────────────

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending...';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(r => { btn.textContent = r.ok ? 'Sent!' : 'Error — try email directly'; })
      .catch(() => { btn.textContent = 'Error — try email directly'; });
  });
}

// ── BOOT ───────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderCerts();
  renderAchievements();
  initNav();
  initContactForm();
  setTimeout(typeWriter, 500);

  // observer runs after render so elements exist
  setTimeout(initObserver, 100);
});
