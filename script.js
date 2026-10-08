/**
 * Christopher Mejo, Ph.D. - Portfolio & Resume Interactivity
 * Accessible, Lightweight, Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCopyButtons();
  initPrintButton();
  initScrollSpy();
  initScheduleModal();
  initRAGVisualizer();
});

/* --------------------------------------------------------------------------
   Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(toggleBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('.theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('aria-label', 'Switch to dark theme');
  } else {
    icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.setAttribute('aria-label', 'Switch to light theme');
  }
}

/* --------------------------------------------------------------------------
   Mobile Navigation & Keyboard Support
   -------------------------------------------------------------------------- */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('mobile-open');
    });
  });
}

/* --------------------------------------------------------------------------
   Copy to Clipboard & Toast Notifications
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = 'work@cmejo.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('✓ Email copied: work@cmejo.com');
      } catch (err) {
        showToast('Email: work@cmejo.com');
      }
    });
  });

  const copyMdBtn = document.getElementById('copy-markdown-btn');
  if (copyMdBtn) {
    copyMdBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('resume.md');
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        showToast('✓ Full Markdown resume copied to clipboard!');
      } catch (err) {
        window.location.href = 'resume.md';
      }
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   Print Resume Trigger
   -------------------------------------------------------------------------- */
function initPrintButton() {
  const printBtns = document.querySelectorAll('.print-resume-btn');
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll Spy for Active Section
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Schedule Screening Chat Modal (<dialog>)
   -------------------------------------------------------------------------- */
function initScheduleModal() {
  const dialog = document.getElementById('schedule-dialog');
  const openBtns = document.querySelectorAll('.open-schedule-modal-btn');
  const closeBtn = document.getElementById('close-schedule-dialog');

  if (!dialog) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });
  }

  // Light dismiss on backdrop click
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });
}

/* --------------------------------------------------------------------------
   AI Scholar Interactive Architecture Visualizer
   -------------------------------------------------------------------------- */
const RAG_DATA = {
  quantum: {
    query: "Surface code quantum error correction thresholds for lattice gauge theory",
    faiss: {
      score: "0.942 Cosine Similarity",
      matches: "Top-k (k=10) dense passages from 15M+ corpus via custom physics embeddings"
    },
    bm25: {
      score: "16.85 BM25 Score",
      terms: "Exact lexical tokens: 'surface code', 'threshold', 'gauge theory', 'stabilizer'"
    },
    neo4j: {
      score: "3-hop Graph Path",
      path: "Entity (Lattice Gauge Theory) → Subgraph (Google Quantum AI) → Method (VQE / Surface Code)"
    },
    meta: {
      rerank: "+42.4% NDCG@10 vs baseline",
      uncertainty: "Evidential Variance σ² = 0.041 (High Confidence)",
      response: "Surface codes exhibit fault-tolerant thresholds (~1% per physical gate) under toric topology. In lattice gauge simulations, mapping gauge invariants onto syndrome measurements allows variational quantum eigensolvers (VQE) to mitigate error propagation across 50+ qubits.",
      citations: ["[Fowler et al., Phys. Rev. A]", "[Mejo et al., Google Quantum AI Initiative]", "[Aaronson et al., ACM STOC]"]
    }
  },
  finance: {
    query: "Heterogeneous Graph Attention Networks for financial regime shift detection",
    faiss: {
      score: "0.918 Cosine Similarity",
      matches: "Dense embedding match on multi-horizon cross-asset volatility tensors"
    },
    bm25: {
      score: "14.92 BM25 Score",
      terms: "Lexical tokens: 'Heterogeneous Graph', 'HAN', 'regime-shift', 'Sharpe'"
    },
    neo4j: {
      score: "2-hop Cross-Asset Graph",
      path: "Node (Microsecond Tick Dynamics) → Edge (Cross-Correlation) → Regime (Mean-Reverting Stat-Arb)"
    },
    meta: {
      rerank: "+38.7% NDCG@10 vs baseline",
      uncertainty: "Evidential Variance σ² = 0.052 (High Confidence)",
      response: "Dynamic HAN models cross-asset node correlations across microsecond tick, intraday, and multi-week horizons. By weighting topological edges through attention heads, regime transitions are flagged with a 19% improvement in detection accuracy, preserving Sharpe >6.0.",
      citations: ["[Wang et al., KDD]", "[Braverock Research Memo 2023]", "[Vaswani et al., NeurIPS]"]
    }
  },
  privacy: {
    query: "Differential privacy in federated deep learning for medical X-ray diagnostics",
    faiss: {
      score: "0.935 Cosine Similarity",
      matches: "Dense semantic representation of privacy budget (ε, δ) & EfficientNet-B7 transfer"
    },
    bm25: {
      score: "15.41 BM25 Score",
      terms: "Lexical tokens: 'differential privacy', 'federated learning', 'chest X-ray', 'ROC-AUC'"
    },
    neo4j: {
      score: "2-hop Hospital Cluster Graph",
      path: "Node (RapidRads AI) → Multi-Hospital Nodes (4 clinical sites) → Protocol (DP-SGD ε=1.2)"
    },
    meta: {
      rerank: "+41.1% NDCG@10 vs baseline",
      uncertainty: "Evidential Variance σ² = 0.038 (High Confidence)",
      response: "Federated deployment across 4 medical centers achieves 0.972 ROC-AUC under strict differential privacy (ε = 1.2, δ = 10⁻⁵). Gradient clipping and calibrated Gaussian noise prevent patient data leakage while ensemble CNN Grad-CAM ensures transparent clinical validation.",
      citations: ["[Abadi et al., ACM CCS]", "[RapidRads Clinical Study 2021]", "[Tan & Le, ICML EfficientNet]"]
    }
  }
};

function initRAGVisualizer() {
  const selector = document.getElementById('rag-query-selector');
  if (!selector) return;

  const faissBox = document.getElementById('rag-faiss-metric');
  const bm25Box = document.getElementById('rag-bm25-metric');
  const neo4jBox = document.getElementById('rag-neo4j-metric');
  const metaBadge = document.getElementById('rag-meta-badge');
  const uncertaintyBadge = document.getElementById('rag-uncertainty-badge');
  const outputText = document.getElementById('rag-output-text');
  const citationsBox = document.getElementById('rag-citations');

  function updateVisualizer(key) {
    const data = RAG_DATA[key];
    if (!data) return;

    if (faissBox) faissBox.innerHTML = `<strong>${data.faiss.score}</strong><br><span style="color: var(--text-muted);">${data.faiss.matches}</span>`;
    if (bm25Box) bm25Box.innerHTML = `<strong>${data.bm25.score}</strong><br><span style="color: var(--text-muted);">${data.bm25.terms}</span>`;
    if (neo4jBox) neo4jBox.innerHTML = `<strong>${data.neo4j.score}</strong><br><span style="color: var(--text-muted);">${data.neo4j.path}</span>`;
    if (metaBadge) metaBadge.textContent = data.meta.rerank;
    if (uncertaintyBadge) uncertaintyBadge.textContent = data.meta.uncertainty;
    if (outputText) outputText.textContent = data.meta.response;

    if (citationsBox) {
      citationsBox.innerHTML = data.meta.citations.map(c => `<span class="rag-citation-tag">${c}</span>`).join('');
    }
  }

  selector.addEventListener('change', (e) => {
    updateVisualizer(e.target.value);
  });

  // Initial populate
  updateVisualizer(selector.value || 'quantum');
}
