/**
 * Christopher Mejo, Ph.D. — Portfolio Interactions, Modal Inquiry, GA4 & Social Attribution
 */

const ANALYTICS_CONFIG = {
  // Replace 'G-XXXXXXXXXX' in index.html[data-ga-id] or below with your live GA4 Measurement ID
  gaMeasurementId: document.documentElement.getAttribute('data-ga-id') || 'G-XXXXXXXXXX'
};

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = gtag;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEmailCopy();
  const attribution = captureTrafficAttribution();
  initAnalytics(attribution);
  initEventTracking(attribution);
  initInquiryModal(attribution);
  initDeepLinkNotes(attribution);
});

function initTheme() {
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Default to crisp white ('light') theme unless user explicitly chose otherwise
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateThemeLabel(themeBtn, savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeLabel(themeBtn, next);
      trackEvent('theme_toggle', { theme: next });
    });
  }
}

function updateThemeLabel(btn, theme) {
  if (!btn) return;
  btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  btn.textContent = theme === 'light' ? '☾' : '☀';
}

function initEmailCopy() {
  document.querySelectorAll('.copy-email').forEach((btn) => {
    const originalText = btn.textContent;
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'work@cmejo.com';
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = 'Copied ✓';
        showToast(`Copied ${email}`);
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/**
 * Native <dialog> Modal for Feature 2 (15-Min Intro Call) & Feature 6 (Project/Role Inquiry)
 */
function initInquiryModal(attribution) {
  const dialog = document.getElementById('inquiry-dialog');
  const form = document.getElementById('inquiry-form');
  const cancelBtn = document.getElementById('dialog-cancel-btn');
  const submitBtn = document.getElementById('inquiry-submit-btn');
  const errorBox = document.getElementById('form-error-msg');

  if (!dialog || !form) return;

  // Populate hidden attribution inputs
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  setVal('attr-source', attribution.network);
  setVal('attr-channel', attribution.channel);
  setVal('attr-campaign', attribution.utm_campaign);
  setVal('attr-referrer', attribution.referrer);

  // Open modal triggers
  document.querySelectorAll('.open-inquiry-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const track = btn.getAttribute('data-inquiry-track');
      if (track) {
        const radio = form.querySelector(`input[name="engagement_track"][value="${CSS.escape(track)}"]`);
        if (radio) radio.checked = true;
      }
      if (errorBox) errorBox.textContent = '';
      dialog.showModal();
    });
  });

  // Cancel button closes explicitly with 'cancel'
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      dialog.close('cancel');
    });
  }

  // Read and reset returnValue on close per modern-web-guidance dialog rules
  dialog.addEventListener('close', () => {
    const outcome = dialog.returnValue || 'dismissed';
    trackEvent('inquiry_dialog_close', { outcome, social_source: attribution.network });
    dialog.returnValue = '';
  });

  // Light-dismiss fallback for browsers without native closedby="any" support
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    let pointerDownOutside = false;
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };
    dialog.addEventListener('pointerdown', (e) => {
      pointerDownOutside = isOutside(e);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pointerDownOutside && isOutside(e)) {
        dialog.close('backdrop');
      }
      pointerDownOutside = false;
    });
  }

  // Validation Timing Matrix: validate on blur, reset error state on input
  const requiredFields = form.querySelectorAll('input[required], textarea[required]');
  requiredFields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (!field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
      }
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
        field.removeAttribute('aria-invalid');
      }
      if (errorBox && errorBox.textContent) {
        errorBox.textContent = '';
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const gotcha = document.getElementById('inquiry-gotcha');
    if (gotcha && gotcha.value) {
      dialog.close('honeypot');
      return;
    }

    // Validate all required fields on submit
    if (!form.checkValidity()) {
      let firstInvalid = null;
      requiredFields.forEach((field) => {
        if (!field.checkValidity()) {
          field.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = field;
        }
      });
      if (errorBox) {
        errorBox.textContent = 'Please complete all required fields (Name, valid Work Email, and Context).';
      }
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const formData = new FormData(form);
    const track = formData.get('engagement_track') || '15-Min Intro Call';
    const fullName = formData.get('full_name') || '';
    const email = formData.get('email') || '';
    const org = formData.get('organization') || 'Not specified';
    const message = formData.get('message') || '';

    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    trackEvent('generate_lead', {
      event_category: 'conversion_inquiry',
      engagement_track: track,
      social_source: attribution.network,
      traffic_channel: attribution.channel,
      utm_campaign: attribution.utm_campaign
    });

    // Attempt direct Formspree POST; gracefully fall back to pre-formatted mailto so zero leads are lost
    let sentViaEndpoint = false;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        sentViaEndpoint = true;
      }
    } catch {
      sentViaEndpoint = false;
    }

    if (!sentViaEndpoint) {
      const subject = encodeURIComponent(`[${track}] ${fullName}${org !== 'Not specified' ? ' (' + org + ')' : ''}`);
      const body = encodeURIComponent(
        `Engagement Track: ${track}\n` +
        `Name: ${fullName}\n` +
        `Email: ${email}\n` +
        `Organization: ${org}\n\n` +
        `Message / Call Times:\n${message}\n\n` +
        `---\nReferral Source: ${attribution.network} (${attribution.channel})`
      );
      window.location.href = `mailto:work@cmejo.com?subject=${subject}&body=${body}`;
    }

    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
    dialog.close('submitted');
    showToast('Inquiry prepared for Christopher (work@cmejo.com) ✓');
  });
}

/**
 * Deep-link support & GA4 tracking for Feature 3 (Engineering Notes <details>)
 */
function initDeepLinkNotes(attribution) {
  const openHashTarget = () => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#note-')) return;
    const target = document.querySelector(hash);
    if (target && target.tagName === 'DETAILS') {
      target.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  openHashTarget();
  window.addEventListener('hashchange', openHashTarget);

  document.querySelectorAll('.note-card').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        trackEvent('engineering_note_expand', {
          note_id: details.id || 'unknown',
          social_source: attribution.network,
          traffic_channel: attribution.channel
        });
      }
    });
  });
}

/**
 * Parses UTM parameters, social click IDs, ?ref= tags, and document.referrer
 * to accurately attribute visits from LinkedIn, X/Twitter, GitHub, AI Engines, and Search.
 */
function captureTrafficAttribution() {
  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer || '';
  let refHost = '';

  try {
    if (referrer) refHost = new URL(referrer).hostname.toLowerCase();
  } catch {
    refHost = '';
  }

  const utmSource = (params.get('utm_source') || params.get('ref') || params.get('source') || '').toLowerCase();
  const utmMedium = (params.get('utm_medium') || '').toLowerCase();
  const utmCampaign = params.get('utm_campaign') || '';
  const utmContent = params.get('utm_content') || '';

  let network = 'direct';
  let channel = 'direct';

  const socialPatterns = [
    { match: ['linkedin.com', 'lnkd.in'], param: 'li_fat_id', name: 'linkedin', channel: 'social' },
    { match: ['x.com', 'twitter.com', 't.co'], param: 'twclid', name: 'x_twitter', channel: 'social' },
    { match: ['github.com'], param: null, name: 'github', channel: 'social_code' },
    { match: ['news.ycombinator.com'], param: null, name: 'hacker_news', channel: 'social' },
    { match: ['reddit.com', 'redd.it'], param: null, name: 'reddit', channel: 'social' },
    { match: ['substack.com'], param: null, name: 'substack', channel: 'newsletter' },
    { match: ['youtube.com', 'youtu.be'], param: null, name: 'youtube', channel: 'video_social' },
    { match: ['facebook.com', 'instagram.com', 'threads.net'], param: 'fbclid', name: 'meta', channel: 'social' },
    { match: ['chatgpt.com', 'openai.com'], param: null, name: 'chatgpt', channel: 'ai_referral' },
    { match: ['claude.ai'], param: null, name: 'claude', channel: 'ai_referral' },
    { match: ['perplexity.ai'], param: null, name: 'perplexity', channel: 'ai_referral' },
    { match: ['gemini.google.com'], param: null, name: 'gemini', channel: 'ai_referral' },
    { match: ['google.'], param: 'gclid', name: 'google', channel: 'organic_search' },
    { match: ['bing.com'], param: 'msclkid', name: 'bing', channel: 'organic_search' },
    { match: ['duckduckgo.com'], param: null, name: 'duckduckgo', channel: 'organic_search' }
  ];

  if (utmSource) {
    network = utmSource;
    channel = utmMedium || 'campaign';
  } else {
    for (const rule of socialPatterns) {
      const hostMatch = rule.match.some((domain) => refHost.includes(domain));
      const paramMatch = rule.param && params.has(rule.param);
      if (hostMatch || paramMatch) {
        network = rule.name;
        channel = rule.channel;
        break;
      }
    }
    if (network === 'direct' && refHost && !refHost.includes(window.location.hostname)) {
      network = refHost;
      channel = 'referral';
    }
  }

  const currentAttribution = {
    network,
    channel,
    utm_source: utmSource || network,
    utm_medium: utmMedium || channel,
    utm_campaign: utmCampaign || '(not set)',
    utm_content: utmContent || '(not set)',
    referrer: referrer || 'direct',
    landing_path: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  try {
    if (!sessionStorage.getItem('cmejo_attribution') || utmSource || (network !== 'direct')) {
      sessionStorage.setItem('cmejo_attribution', JSON.stringify(currentAttribution));
    }
    return JSON.parse(sessionStorage.getItem('cmejo_attribution')) || currentAttribution;
  } catch {
    return currentAttribution;
  }
}

function initAnalytics(attribution) {
  const gaId = ANALYTICS_CONFIG.gaMeasurementId;
  const isConfigured = gaId && gaId !== 'G-XXXXXXXXXX' && gaId.startsWith('G-');

  gtag('js', new Date());
  if (isConfigured) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.body.appendChild(script);

    gtag('config', gaId, {
      anonymize_ip: true,
      campaign_source: attribution.utm_source,
      campaign_medium: attribution.utm_medium,
      campaign_name: attribution.utm_campaign
    });
  }

  if (attribution.network !== 'direct') {
    trackEvent('social_referral_visit', {
      social_network: attribution.network,
      traffic_channel: attribution.channel,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      referrer_url: attribution.referrer
    });
  }
}

function initEventTracking(attribution) {
  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      const action = el.getAttribute('data-track');
      const href = el.getAttribute('href') || '';

      let category = 'engagement';
      if (action.startsWith('resume_')) category = 'conversion_resume';
      else if (action.startsWith('email_') || action.startsWith('book_') || action.startsWith('open_form_')) category = 'conversion_contact';
      else if (action.startsWith('social_') || action.startsWith('project_')) category = 'outbound_social';

      trackEvent(action, {
        event_category: category,
        link_url: href,
        social_source: attribution.network,
        traffic_channel: attribution.channel,
        utm_campaign: attribution.utm_campaign
      });
    });
  });
}

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
