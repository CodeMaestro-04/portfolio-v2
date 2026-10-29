/**
 * Abhinav Kumar Singh — Modern Brutalist Developer Portfolio
 * Interactive Scripts & Micro-interactions (GertiX Studio Design System)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initHeroCanvas();
  initTypeWriter();
  initSkillFilters();
  initFooterSpotlight();
  initInteractiveTerminal();
  initResumeModal();
  setupInteractivePipeline();
});

// ==========================================
// 1. HEADER SCROLL DETECTION
// ==========================================
function initHeaderScroll() {
  const header = document.querySelector('.cb-site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ==========================================
// 2. MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
  const header = document.querySelector('.cb-site-header');
  const burger = document.querySelector('.cb-site-header__burger');
  const menuLinks = document.querySelectorAll('.cb-site-header__menu a');

  if (!burger || !header) return;

  burger.addEventListener('click', () => {
    header.classList.toggle('is-open');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('is-open');
    });
  });
}

// ==========================================
// 3. HERO CANVAS 3D PARTICLES & CONSTELLATION
// ==========================================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 40;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.size = Math.random() * 2 + 1;
      this.baseColor = 'rgba(37, 184, 149, '; // Gertix Chromata green
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        this.x -= (dx / dist) * 0.7;
        this.y -= (dy / dist) * 0.7;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 140) * 0.18;
          ctx.strokeStyle = `rgba(155, 172, 174, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.setLineDash([2, 4]); // Dashed blueprint lines
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 4. HERO TYPEWRITER EFFECT
// ==========================================
const typeWords = [
  "Agentic AI System Design",
  "Python & Django REST APIs",
  "RabbitMQ & Telegram Bot Systems",
  "Next.js & React Web Apps",
  "Java & Spring Boot Backend",
  "PostgreSQL, SQL & Hibernate JPA"
];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingDelay = 75;
const erasingDelay = 35;
const newWordDelay = 1800;

function initTypeWriter() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  function type() {
    const currentWord = typeWords[wordIdx];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIdx === currentWord.length) {
      speed = newWordDelay;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % typeWords.length;
      speed = 350;
    }

    setTimeout(type, speed);
  }

  type();
}

// ==========================================
// 5. INTERACTIVE SKILL MATRIX FILTERS
// ==========================================
function initSkillFilters() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.skill-item');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================
// 6. FOOTER MOUSE-FOLLOWING SPOTLIGHT
// ==========================================
function initFooterSpotlight() {
  const footer = document.querySelector('.cb-site-footer');
  if (!footer) return;

  footer.addEventListener('mousemove', (e) => {
    const rect = footer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    footer.style.setProperty('--mouse-x', `${x}px`);
    footer.style.setProperty('--mouse-y', `${y}px`);
  });
}

// ==========================================
// 7. INTERACTIVE TERMINAL WINDOW
// ==========================================
const terminalFiles = {
  'profile.json': `{
  "name": "Abhinav Kumar Singh",
  "hometown": "Dhanbad, Jharkhand",
  "current_location": "New Delhi",
  "role": "Full Stack Developer Intern @ Easy Insights",
  "production_focus": [
    "Web App Development (React, Django REST Framework, PostgreSQL, PostHog)",
    "Task Processing & Monitoring System (Python, RabbitMQ, Telegram Bot API, PostgreSQL)",
    "Python Scripts for Meta & Google Landing Page URLs and Meta Instant Forms",
    "Python Scripts for DigitalOcean Active Server Discovery"
  ]
}`,

  'production.log': `[2026-10-17 10:45:12] [RabbitMQ] Worker #4 connected to amqp://easyinsights-cluster
[2026-10-17 10:45:14] [Celery/Worker] Task received: process_lead_enrichment_v2 [ID: #8941]
[2026-10-17 10:45:15] [PostgreSQL] Query execution: UPDATE task_logs SET status='PROCESSING' (1.4ms)
[2026-10-17 10:45:18] [TelegramBotAPI] Bot notification dispatched to Ops Channel: ✅ Task #8941 Completed.
[2026-10-17 10:45:20] [SpringAI] Model Comparison Ping: Ollama: 142ms, OpenAI: 280ms, Claude: 310ms
[2026-10-17 10:45:22] [System Health] Heap: 314MB/2048MB | Workers Active: 6 | Failed Tasks: 0`,

  'skills.sh': `#!/bin/bash
echo "=== CORE TECHNICAL SPECIFICATIONS ==="
echo "LANGUAGES      : Java 17, Python 3, JavaScript (ES6+), SQL, OOP (SOLID)"
echo "FRAMEWORKS/WEB : Next.js, React, Spring Boot, Django, Hibernate JPA, REST APIs"
echo "AI & AGENTIC   : Agentic AI System Design, Multi-Agent Workflows, Spring AI, Gemini API, Ollama"
echo "METHODOLOGY    : SDLC (Agile, Sprint Cycles, Code Review, Testing & QA)"
echo "MESSAGING/MQ   : RabbitMQ, Celery, Telegram Bot API"
echo "DATABASES      : PostgreSQL, MySQL, Relational Schema Normalization"
echo "TOOLS & DEPLOY : Git, GitHub, Linux, VS Code, Eclipse IDE, Apache Tomcat, Postman, PostHog"
echo "ACADEMICS      : B.Tech in IT (2023-2026) @ Netaji Subhash Engineering College"`,

  'git-status.sh': `On branch main
Your branch is up to date with 'origin/main'.

Recent commits:
* 9a8c1f4 feat: integrate Telegram Bot API with RabbitMQ failure monitor
* 7b2e401 feat: multi-model parallel inference with Spring AI & Ollama
* 3f1a92b feat: Aadhaar one-to-one entity relational mapping in JPA
* c42d590 feat: PDF Genie semantic search pipeline using Gemini API
* 108ef93 init: enterprise employee management system on Tomcat`
};

function initInteractiveTerminal() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const body = document.getElementById('terminal-content');
  if (!body) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const fileName = tab.getAttribute('data-file');
      if (terminalFiles[fileName]) {
        body.innerHTML = `
          <div class="terminal-line"><span class="terminal-prompt">abhinav@workspace:~$</span> <span class="terminal-cmd">cat ${fileName}</span></div>
          <div class="terminal-output" style="white-space: pre-wrap; margin-top: 0.5rem;">${terminalFiles[fileName]}</div>
          <div class="terminal-line" style="margin-top: 0.75rem;"><span class="terminal-prompt">abhinav@workspace:~$</span> <span class="terminal-cursor"></span></div>
        `;
      }
    });
  });
}

// ==========================================
// 8. RESUME MODAL & LATEX VIEWER
// ==========================================
const latexResumeSource = `% =========================================================
% ABHINAV KUMAR SINGH — RESUME SOURCE
% =========================================================
\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym,xcolor,ragged2e,geometry,titlesec,hyperref,marvosym}
\\definecolor{darkblue}{RGB}{0,0,139}

\\begin{document}
\\begin{center}
{\\Huge\\bfseries ABHINAV KUMAR SINGH}\\\\[3pt]
\\small +91 6200529532 \\quad | \\quad abhinavkrsingh83@gmail.com \\\\
\\href{https://www.linkedin.com/in/abhinav-kr-singh04}{LinkedIn} \\quad | \\quad 
\\href{https://github.com/CodeMaestro-04}{CodeMaestro-04} \\quad | \\quad Dhanbad, Jharkhand
\\end{center}

\\section{\\textbf{Summary}}
Full Stack Developer Intern with hands-on experience in developing web applications, 
REST APIs, and database-driven systems. Proficient in Java, Python, JavaScript, and SQL,
with experience in React, Django, Spring Boot, PostgreSQL, and Hibernate.

\\section{\\textbf{Professional Experience}}
\\textbf{Easy Insights Pvt. Ltd., New Delhi} \\hfill \\textit{10 Aug 2026 -- Present} \\\\
\\textit{Full Stack Developer Intern}
\\begin{itemize}
  \\item Developing web features using React and backend services with Django REST Framework.
  \\item Implemented asynchronous task processing using RabbitMQ with worker status & failure monitoring.
  \\item Integrated PostgreSQL for persistent task logging and execution-status tracking.
\\end{itemize}

\\section{\\textbf{Key Projects}}
\\begin{itemize}
  \\item \\textbf{Multi SpringAI Chat App}: Multi-model AI comparison engine (Java, Spring Boot, Spring AI, React, Ollama, OpenAI).
  \\item \\textbf{Aadhaar Management System}: Relational security APIs (Java 17, Spring Boot, Hibernate, MySQL).
  \\item \\textbf{PDF GENIE}: AI-Powered PDF Q&A with Gemini API (200+ pages, 95% relevance score).
  \\item \\textbf{Employee Management System}: MVC CRUD application deployed on Apache Tomcat.
\\end{itemize}

\\section{\\textbf{Technical Skills}}
\\begin{itemize}
  \\item \\textbf{Languages \\& Core:} Java 17, Python 3, JavaScript (ES6+), SQL, OOP (Object-Oriented Programming)
  \\item \\textbf{Frameworks \\& Web:} Next.js, React, Spring Boot, Spring AI, Django REST, Hibernate JPA, HTML5, CSS3, Bootstrap
  \\item \\textbf{AI \\& System Design:} Agentic AI System Design, Multi-Agent Workflows, LLM Tool Calling, Gemini API
  \\item \\textbf{Methodology \\& Lifecycle:} SDLC (Agile, Scrum, Sprint Delivery, Code Reviews, QA)
  \\item \\textbf{Messaging \\& APIs:} RabbitMQ, Telegram Bot API, Celery, RESTful APIs
  \\item \\textbf{Databases:} PostgreSQL, MySQL, Oracle
  \\item \\textbf{Tools \\& IDEs:} Git, GitHub, Linux, Eclipse IDE, VS Code, Postman, PostHog, Apache Tomcat
\\end{itemize}

\\section{\\textbf{Education}}
\\textbf{B.Tech in Information Technology} \\hfill Netaji Subhash Engineering College (2023--2026) \\\\
\\textbf{Diploma in Electrical Engineering} \\hfill Government Polytechnic Sahibganj (2023) \\\\
\\textbf{Higher Secondary Education} \\hfill D.A.V. Public School Koylanagar (2020) \\\\
\\textbf{Secondary Education} \\hfill D.A.V. Public School Koylanagar (2018)
\\end{document}`;

function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const atsTabBtn = document.getElementById('modal-tab-ats');
  const texTabBtn = document.getElementById('modal-tab-tex');
  const atsView = document.getElementById('modal-ats-view');
  const texView = document.getElementById('modal-tex-view');
  const copyTexBtn = document.getElementById('copy-tex-btn');

  if (!modal) return;

  window.openModal = function(id) {
    if (id === 'resume-modal') {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeModal();
  });

  if (atsTabBtn && texTabBtn && atsView && texView) {
    atsTabBtn.addEventListener('click', () => {
      atsTabBtn.classList.add('active');
      texTabBtn.classList.remove('active');
      atsView.style.display = 'block';
      texView.style.display = 'none';
      if (copyTexBtn) copyTexBtn.style.display = 'none';
    });

    texTabBtn.addEventListener('click', () => {
      texTabBtn.classList.add('active');
      atsTabBtn.classList.remove('active');
      atsView.style.display = 'none';
      texView.style.display = 'block';
      texView.textContent = latexResumeSource;
      if (copyTexBtn) copyTexBtn.style.display = 'inline-flex';
    });
  }

  if (copyTexBtn) {
    copyTexBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(latexResumeSource).then(() => {
        showToast('LaTeX source code copied to clipboard!');
      });
    });
  }
}

// ==========================================
// 9. TOAST NOTIFICATIONS & CLIPBOARD UTILITIES
// ==========================================
let toastTimer = null;

window.showToast = function(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399; font-size: 1.1rem;"></i> <span>${msg}</span>`;
  toast.classList.add('show');

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

window.copyToClipboard = function(text, label, triggerElement, event) {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }

  function handleSuccess() {
    showToast(`Copied ${label || 'text'} to clipboard!`);

    if (triggerElement) {
      triggerElement.classList.add('is-copied');
      const textSpan = triggerElement.querySelector('span');
      const originalText = textSpan ? textSpan.textContent : null;
      const icon = triggerElement.querySelector('i');
      const originalIconClass = icon ? icon.className : null;

      if (textSpan) textSpan.textContent = 'Copied!';
      if (icon) icon.className = 'fa-solid fa-check';

      setTimeout(() => {
        triggerElement.classList.remove('is-copied');
        if (textSpan && originalText) textSpan.textContent = originalText;
        if (icon && originalIconClass) icon.className = originalIconClass;
      }, 2000);
    }
  }

  function fallbackCopy(val) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = val;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        handleSuccess();
        return;
      }
    } catch (e) {
      console.warn('Fallback copy failed', e);
    }

    // Secondary fallback
    window.prompt('Copy to clipboard: Ctrl+C or Cmd+C, then Enter', val);
  }

  if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text)
      .then(() => {
        handleSuccess();
      })
      .catch((err) => {
        console.warn('Clipboard writeText failed, trying fallback', err);
        fallbackCopy(text);
      });
  } else {
    fallbackCopy(text);
  }
};

// ==========================================
// 10. INTERACTIVE ARCHITECTURE PIPELINE (Telegram Bot, RabbitMQ & PostgreSQL)
// ==========================================
function setupInteractivePipeline() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const archSvg = document.getElementById('archSvg');
  const dotsGroup = document.getElementById('archDots');
  const captionEl = document.getElementById('archCaption');

  if (!archSvg || !dotsGroup || !captionEl) return;

  const CAPTIONS = {
    telegram: 'Telegram Bot Interface: Built with Python & Telegram Bot API, integrated with company APIs to trigger and manage task-related operations.',
    api: 'Company APIs: Dispatches task operations into RabbitMQ queues for asynchronous background processing.',
    heartbeat: 'Worker Status & Failure Monitor: Tracks RabbitMQ worker execution status, detects failures, and logs every state transition in PostgreSQL.'
  };
  const DEFAULT_CAPTION = captionEl.textContent.trim();

  function createFlowDot(pathId, cls, beginSec, durSec) {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', '4.5');
    circle.setAttribute('class', cls);

    const anim = document.createElementNS(svgNS, 'animateMotion');
    anim.setAttribute('dur', durSec + 's');
    anim.setAttribute('repeatCount', 'indefinite');
    anim.setAttribute('begin', beginSec + 's');

    const mpath = document.createElementNS(svgNS, 'mpath');
    mpath.setAttribute('href', '#' + pathId);

    anim.appendChild(mpath);
    circle.appendChild(anim);
    dotsGroup.appendChild(circle);
  }

  // Add animated data packets flowing along paths
  ['aw0', 'aw1', 'aw2'].forEach((id, idx) => {
    createFlowDot(id, 'dot-pulse-a', -idx * 0.45, 1.8);
  });
  createFlowDot('awm', 'dot-pulse-b', 0, 1.0);
  createFlowDot('awm', 'dot-pulse-b', -0.5, 1.0);
  ['ad0', 'ad1', 'ad2'].forEach((id, idx) => {
    createFlowDot(id, 'dot-pulse-b', -idx * 0.45, 1.6);
  });

  // Interactive source click handler
  const sources = Array.from(archSvg.querySelectorAll('.src-group'));
  const wires = Array.from(archSvg.querySelectorAll('.src-wire'));

  function selectSource(key) {
    const isSame = archSvg.dataset.selected === key;
    archSvg.dataset.selected = isSame ? '' : key;
    archSvg.classList.toggle('filtered', !isSame);

    sources.forEach((g) => {
      g.classList.toggle('active', !isSame && g.dataset.k === key);
    });
    wires.forEach((w) => {
      w.classList.toggle('on', !isSame && w.dataset.k === key);
    });
    captionEl.textContent = isSame ? DEFAULT_CAPTION : (CAPTIONS[key] || DEFAULT_CAPTION);
  }

  sources.forEach((g) => {
    g.addEventListener('click', () => selectSource(g.dataset.k));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectSource(g.dataset.k);
      }
    });
  });
}

// ==========================================
// 10. THEME SWITCHER (Dark & Light Mode)
// ==========================================
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default to stored preference, or system dark, or dark by default
  let currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');

  function updateButtonUI(theme) {
    if (!themeToggleBtn) return;
    const label = themeToggleBtn.querySelector('.theme-toggle-label');
    if (label) {
      label.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
    }
    const targetMode = theme === 'dark' ? 'Light' : 'Dark';
    themeToggleBtn.setAttribute('title', `Switch to ${targetMode} Mode (Press T)`);
    themeToggleBtn.setAttribute('aria-label', `Switch to ${targetMode} Mode`);
  }

  function applyTheme(theme, save = true) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch (err) {}
    }
    updateButtonUI(theme);
  }

  // Apply initial theme
  applyTheme(currentTheme, false);

  // Button Click Listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
      if (typeof showToast === 'function') {
        showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
      }
    });
  }

  // Keyboard shortcut: Press 'T' or 't' to toggle theme (when not typing in form inputs)
  window.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 't' || e.key === 'T') {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
      if (typeof showToast === 'function') {
        showToast(`Theme: ${nextTheme.toUpperCase()} (Shortcut: T)`);
      }
    }
  });

  // Listen for OS system theme changes if user hasn't explicitly saved a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }
}
