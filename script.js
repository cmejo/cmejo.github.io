/**
 * Christopher Mejo, Ph.D. — Portfolio Interactions, GA4 & Social Referral Attribution
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
});

function initTheme() {
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
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
  setTimeout(() => toast.classList.remove('show'), 2500);
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
      else if (action.startsWith('email_')) category = 'conversion_contact';
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
