/* =============================================
   LIONS PORTFOLIO — app.js
   Leonardo G. Mendoza · lions.sandlj.com.br
   ============================================= */

'use strict';

// ================================================
// LIONS AGENT — GEMINI CONFIG
// ================================================
const LIONS_SYSTEM_PROMPT = `
Você é o Lions Agent 🦁 — o assistente de IA pessoal do portfólio de Leonardo G. Mendoza.

SOBRE LEONARDO:
- Nome completo: Leonardo G. Mendoza (também chamado de Leo)
- País: Brasil
- Formação atual: Pós-Graduação "AI Scientist" na FIAP (Pós Tech) — em andamento
- Conquistou nota 90/100 no Tech Challenge Fase 1 (CRISP-DM + Random Forest + SMOTE)
- Possui VPS próprio no Hostinger (Ubuntu 24.04) com domínio sandlj.com.br gerenciado via Cloudflare
- GitHub: https://github.com/LeonardoGMendoza
- LinkedIn: https://www.linkedin.com/in/leonardogonzalesmendoza/
- Site pessoal: https://lions.sandlj.com.br

TRAJETÓRIA:
- 2022: Desenvolveu Sistema PDV Supermercado em C# — primeiros passos como desenvolvedor
- 2024: Migrou para web — JavaScript, Node.js, APIs, aplicações para clientes reais
- 2025: Entrou no mundo de Python, Machine Learning e IA Generativa com Gemini
- 2026: Cursa AI Scientist na FIAP, tem múltiplos projetos online, VPS próprio e criou o Lions Agent

PROJETOS PRINCIPAIS:
1. PayFlow Risk Model — Monitor de risco com Random Forest + SMOTE + metodologia CRISP-DM. Nota 90/100 na FIAP. GitHub: LeonardoGMendoza/payflow-risk-model-crispdm
2. Secretário IA da Ala — Agente inteligente para gestão e secretariado automatizado. GitHub: LeonardoGMendoza/Secret-rio_IA_da_Ala
3. Enfermeira Feridas — Aplicação web para profissionais de enfermagem em tratamento de feridas. Online no servidor.
4. Brinka Mais Festas — Plataforma completa para empresa de festas. Online em brinkamaisfestas.sandlj.com.br
5. CursoPythonia — Curso de Python online. Online em cursopythonia.sandlj.com.br
6. Sistema PDV Supermercado — Sistema completo em C# para supermercados (2022). GitHub: LeonardoGMendoza/Sistema.Pdv.Supermercado
7. GTPMaker Agent Creator — Ferramenta para criação de agentes IA. GitHub: LeonardoGMendoza/gtpmaker-agent-creator

HABILIDADES TÉCNICAS:
- Python: Pandas, Scikit-learn, Random Forest, SMOTE, Streamlit, Jupyter
- JavaScript: Node.js, automações web, APIs REST
- C#: sistemas desktop, aplicações Windows
- Infraestrutura: VPS Ubuntu 24.04, Nginx, Let's Encrypt/SSL, Cloudflare DNS
- IA/ML: CRISP-DM, Machine Learning, Gemini API, Agentes IA
- Dados: análise exploratória, visualizações, modelos preditivos

INFRAESTRUTURA:
- VPS Hostinger com Ubuntu 24.04 LTS, IP fixo
- Domínio sandlj.com.br com subdomínios via Cloudflare
- Apps online: cursopythonia.sandlj.com.br, brinkamaisfestas.sandlj.com.br, lions.sandlj.com.br

OBJETIVO:
Leonardo quer se tornar um AI Engineer de referência no Brasil, criando soluções de IA que impactem vidas reais. Está comprometido com aprendizado constante.

SEU COMPORTAMENTO:
- Seja amigável, entusiasmado e motivacional
- Use 🦁 ocasionalmente nas respostas
- Quando perguntarem sobre projetos, dê detalhes técnicos
- Se perguntarem algo que não sabe, seja honesto e sugira entrar em contato via LinkedIn
- Responda sempre em português, de forma conversacional
- Seja conciso mas completo
- Celebre as conquistas do Leonardo com entusiasmo
`.trim();

let geminiApiKey = window.LIONS_API_KEY || localStorage.getItem('lions_gemini_key') || '';
let conversationHistory = [];
let agentOpen = false;

// ================================================
// PARTICLES BACKGROUND
// ================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();

      // Mouse repulsion
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,160,23,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    
    // Update and draw particles
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212,160,23,${0.15 * (1 - distance/110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

// ================================================
// NAVBAR SCROLL EFFECT
// ================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ================================================
// TYPEWRITER EFFECT
// ================================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const text = 'Leonardo G. Mendoza';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 80 + Math.random() * 40);
    }
  }
  setTimeout(type, 600);
})();

// ================================================
// ROTATING PHRASES (RIGHT PANEL)
// ================================================
(function initRotatingPhrases() {
  const el = document.getElementById('rotating-phrase');
  if (!el) return;
  const phrases = [
    '"Construindo o futuro com IA 🦁"',
    '"Do C# ao Machine Learning — 4 anos de evolução"',
    '"Nota 90/100 no Tech Challenge FIAP 🏆"',
    '"AI Scientist em formação constante"',
    '"Automação que resolve problemas reais"',
    '"VPS próprio, Nginx, Cloudflare — entrego completo"',
    '"Code. Learn. Deploy. Repeat. 🚀"',
    '"lions.sandlj.com.br — meu território digital"',
  ];
  let idx = 0;

  function rotate() {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = phrases[idx];
      el.style.opacity = '1';
      idx = (idx + 1) % phrases.length;
    }, 500);
  }

  rotate();
  setInterval(rotate, 4000);
})();

// ================================================
// SKILL BARS ANIMATION (Panel Right)
// ================================================
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill, .goal-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.style.getPropertyValue('--w');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  fills.forEach(f => observer.observe(f));

  // Trigger immediately for panel items (always visible)
  setTimeout(() => {
    fills.forEach(f => {
      f.style.width = f.style.getPropertyValue('--w');
    });
  }, 800);
})();

// ================================================
// SCROLL ANIMATIONS (AOS-like)
// ================================================
(function initScrollAnimations() {
  const items = document.querySelectorAll('[data-aos], .timeline-item, .project-card, .expertise-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
})();

// ================================================
// MOBILE MENU
// ================================================
let mobileOpen = false;
function toggleMobileMenu() {
  mobileOpen = !mobileOpen;
  const links = document.querySelector('.nav-links');
  if (!links) return;
  if (mobileOpen) {
    links.style.cssText = `
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 64px; left: 0; right: 0;
      background: rgba(8,8,8,0.97);
      padding: 20px;
      gap: 16px;
      border-bottom: 1px solid rgba(212,160,23,0.2);
      z-index: 999;
    `;
  } else {
    links.style.cssText = '';
  }
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    mobileOpen = false;
    const links = document.querySelector('.nav-links');
    if (links) links.style.cssText = '';
  });
});

// ================================================
// LIONS AGENT — TOGGLE
// ================================================
function toggleAgent() {
  agentOpen = !agentOpen;
  const panel = document.getElementById('agent-panel');
  panel.classList.toggle('open', agentOpen);

  if (agentOpen) {
    // Check if API key is saved
    if (geminiApiKey) {
      const keyBar = document.getElementById('agent-key-bar');
      if (keyBar) keyBar.classList.add('hidden');
      updateAgentStatus('online', 'Pronto para conversar');
    } else {
      updateAgentStatus('connecting', 'Insira sua API Key Gemini');
    }
    setTimeout(() => {
      document.getElementById('agent-input')?.focus();
    }, 350);
  }
}

function updateAgentStatus(state, text) {
  const statusEl = document.getElementById('agent-status');
  const dot = statusEl?.querySelector('.status-dot');
  if (!statusEl) return;
  statusEl.lastChild.textContent = ' ' + text;
  if (dot) {
    dot.style.background = state === 'online' ? 'var(--green)' : '#f59e0b';
    dot.style.boxShadow = state === 'online' ? '0 0 6px var(--green)' : '0 0 6px #f59e0b';
  }
}

// ================================================
// LIONS AGENT — SAVE API KEY
// ================================================
function saveApiKey() {
  const input = document.getElementById('gemini-key-input');
  const key = input?.value?.trim();
  if (!key) {
    alert('Por favor, cole sua chave Gemini API.');
    return;
  }
  geminiApiKey = key;
  localStorage.setItem('lions_gemini_key', key);
  const keyBar = document.getElementById('agent-key-bar');
  if (keyBar) keyBar.classList.add('hidden');
  updateAgentStatus('online', 'Pronto para conversar');
  addBotMessage('Chave salva! Agora pode me perguntar qualquer coisa sobre o Leonardo. 🦁');
}

// ================================================
// LIONS AGENT — MESSAGES
// ================================================
function addBotMessage(text) {
  const messages = document.getElementById('agent-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'agent-msg bot-msg';
  div.innerHTML = `
    <span class="msg-avatar">🦁</span>
    <div class="msg-bubble">${text}</div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
  const messages = document.getElementById('agent-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'agent-msg user-msg';
  div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addTypingIndicator() {
  const messages = document.getElementById('agent-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'agent-msg bot-msg typing-msg';
  div.id = 'typing-indicator';
  div.innerHTML = `<span class="msg-avatar">🦁</span><div class="msg-bubble"></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
  document.getElementById('typing-indicator')?.remove();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function handleAgentKey(event) {
  if (event.key === 'Enter') sendMessage();
}

// ================================================
// LIONS AGENT — SEND MESSAGE TO GEMINI
// ================================================
async function sendMessage() {
  const input = document.getElementById('agent-input');
  const sendBtn = document.getElementById('send-btn');
  const userText = input?.value?.trim();

  if (!userText) return;

  if (!geminiApiKey) {
    addBotMessage('Por favor, insira sua Gemini API Key primeiro! 🔑');
    return;
  }

  input.value = '';
  if (sendBtn) sendBtn.disabled = true;

  addUserMessage(userText);
  addTypingIndicator();

  // Add to history
  conversationHistory.push({
    role: 'user',
    parts: [{ text: userText }]
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: LIONS_SYSTEM_PROMPT }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 512,
            topP: 0.95
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || 'Erro na API');
    }

    const data = await response.json();
    const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';

    // Add to history
    conversationHistory.push({
      role: 'model',
      parts: [{ text: botText }]
    });

    // Keep history to last 20 messages
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    removeTypingIndicator();
    addBotMessage(formatMarkdown(botText));

  } catch (err) {
    removeTypingIndicator();
    console.error('Lions Agent Error:', err);

    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('invalid')) {
      addBotMessage('Chave API inválida! Verifique sua Gemini API Key. 🔑');
    } else if (err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      addBotMessage('Limite da API atingido. Tente novamente em alguns minutos. ⏳');
    } else {
      addBotMessage(`Erro ao conectar com Gemini: ${err.message}. Tente novamente! 🦁`);
    }
  } finally {
    if (sendBtn) sendBtn.disabled = false;
    input?.focus();
  }
}

// ================================================
// FORMAT MARKDOWN BASIC
// ================================================
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(212,160,23,0.1);padding:1px 5px;border-radius:3px;font-size:0.82em">$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ================================================
// INIT — CHECK SAVED API KEY
// ================================================
(function init() {
  if (geminiApiKey) {
    const keyBar = document.getElementById('agent-key-bar');
    if (keyBar) keyBar.classList.add('hidden');
  }

  // Animate hero description delay
  setTimeout(() => {
    document.querySelectorAll('.hero-section > *').forEach((el, i) => {
      el.style.animation = `fadeInUp 0.6s ease ${i * 0.1}s both`;
    });
  }, 100);

  // Add CSS keyframe for fadeInUp
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  console.log('%c🦁 Lions Agent', 'color:#d4a017;font-size:16px;font-weight:bold');
  console.log('%clions.sandlj.com.br · Leonardo G. Mendoza', 'color:#888;font-size:11px');
})();

// ================================================
// HACKER TERMINAL LOGIC
// ================================================
(function initHackerTerminal() {
  const terminal = document.getElementById('terminal-output');
  if (!terminal) return;

  const commands = [
    "[SYS] Analyzing dataset shape: (10432, 18)",
    "[MODEL] Running SMOTE for class imbalance...",
    "[MODEL] Training Random Forest Classifier... done.",
    "[EVAL] Accuracy: 94.2% | Precision: 0.91",
    "[NET] POST /v1beta/models/gemini-2.0-flash",
    "[NET] Latency: 42ms | Status: 200 OK",
    "[VPS] Checking memory usage... 63% used.",
    "[VPS] Restarting Nginx service... success.",
    "[AGENT] Processing natural language query...",
    "[SYS] Extracted entities: ['FIAP', 'AI Scientist']",
    "[OPS] Git pull origin main -> Fast-forward",
    "[CRISP-DM] Business Understanding phase complete.",
    "[SECURITY] Encrypted tunnel established (TLS 1.3)",
    "Loading embeddings... [██████████] 100%"
  ];

  function addTerminalLine() {
    const line = document.createElement('div');
    line.className = 'term-line';
    
    if (Math.random() > 0.7) {
      const hash = Math.random().toString(16).substr(2, 16).toUpperCase();
      line.textContent = `> 0x${hash} INSTRUCTION_RECEIVED`;
    } else {
      line.textContent = commands[Math.floor(Math.random() * commands.length)];
    }

    terminal.appendChild(line);
    
    if (terminal.childElementCount > 8) {
      terminal.removeChild(terminal.firstChild);
    }
    
    terminal.scrollTop = terminal.scrollHeight;
    setTimeout(addTerminalLine, Math.random() * 2000 + 800);
  }

  setTimeout(addTerminalLine, 1500);
})();

