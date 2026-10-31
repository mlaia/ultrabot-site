/* Ultrabot: mobile menu, Platforms submenu, contact form and the home "ask" box. No analytics. */
(() => {
  'use strict';
  const menu = document.querySelector('.ub-menu');
  const nav = document.getElementById('ub-nav');
  const sub = document.querySelector('.ub-has-sub details');

  if (menu && nav) {
    const close = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (sub && sub.open) { sub.open = false; sub.querySelector('summary').focus(); return; }
      if (nav.classList.contains('open')) { close(); menu.focus(); }
    });
  }
  // Close the Platforms submenu when clicking or tabbing elsewhere.
  if (sub) {
    document.addEventListener('click', e => { if (!sub.contains(e.target)) sub.open = false; });
    sub.addEventListener('focusout', e => { if (e.relatedTarget && !sub.contains(e.relatedTarget)) sub.open = false; });
  }

  // Looping avatar clips and the hero wave: a pause/play button (WCAG 2.2.2), paused from the start under reduced motion.
  const clips = document.querySelectorAll('video[autoplay]');
  const motion = document.querySelector('.ub-motion');
  const setMotion = paused => {
    document.documentElement.classList.toggle('ub-paused', paused);
    clips.forEach(v => { if (paused) v.pause(); else { const p = v.play(); if (p) p.catch(() => {}); } });
    if (motion) {
      const he = document.documentElement.lang === 'he';
      motion.textContent = paused ? (he ? 'הפעלת האנימציות' : 'Play animations') : (he ? 'עצירת האנימציות' : 'Pause animations');
    }
  };
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clips.forEach(v => v.removeAttribute('autoplay'));
    setMotion(true);
  }
  if (motion) motion.addEventListener('click', () => setMotion(!document.documentElement.classList.contains('ub-paused')));

  // Home: "Ask the agent your own question" opens the demo in a new tab with the question pre-filled.
  const ask = document.getElementById('ub-ask');
  if (ask) {
    ask.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('ub-q').value.trim();
      if (!q) return;
      window.open('https://talk.mlaia.com/?from=ultrabot.ai#q=' + encodeURIComponent(q), '_blank', 'noopener');
    });
  }

  // Contact form: submit to Formspree without leaving the page. Without JS it posts normally.
  const form = document.querySelector('.ub-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = form.querySelector('.ub-form-status');
      const button = form.querySelector('button[type=submit]');
      const he = document.documentElement.lang === 'he';
      if (!form.reportValidity()) return;
      button.disabled = true;
      status.textContent = he ? 'שולחים את ההודעה…' : 'Sending your message…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Submission failed');
        document.dispatchEvent(new CustomEvent('ub-form-sent', { detail: { topic: (form.querySelector('[name=topic]') || {}).value || '' } }));
        form.reset();
        status.textContent = he ? 'תודה. ההודעה נשלחה, ונחזור אליכם במייל.' : 'Thank you. Your message was sent. We will reply by email.';
      } catch {
        status.textContent = he ? 'לא הצלחנו לשלוח את ההודעה. נסו שוב או כתבו ל-yochai@mlaia.com.' : 'Your message could not be sent. Please try again or email yochai@mlaia.com.';
      } finally {
        button.disabled = false;
      }
    });
  }

  // Analytics: GA4 loads only after the visitor accepts. Until GA_ID is set, no banner and no tracking.
  const GA_ID = ''; // TODO: the Ultrabot GA4 measurement ID (G-…), from the visibility session
  const KEY = 'ultrabot-cookie-consent';
  const he = document.documentElement.lang === 'he';
  const saved = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
  const loadGA = () => {
    if (!GA_ID || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.append(script);
  };
  const track = (name, params) => { if (typeof window.gtag === 'function') window.gtag('event', name, params); };
  if (GA_ID) {
    const css = document.createElement('style');
    css.textContent = '.ub-consent{position:fixed;inset:auto 16px 16px 16px;max-width:560px;margin-inline-start:auto;z-index:50;background:#0a1628;color:#fff;border-radius:18px;padding:18px 20px;box-shadow:0 12px 40px rgba(0,0,0,.3);font-size:15px;line-height:1.5}.ub-consent a{color:#9cc0ff}.ub-consent-actions{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}.ub-consent button{font:inherit;border-radius:999px;padding:9px 18px;border:1px solid #fff;background:#fff;color:#0a1628;cursor:pointer}.ub-consent button.secondary{background:transparent;color:#fff}.ub-consent button:focus-visible{outline:3px solid #9cc0ff;outline-offset:2px}.ub-cookie-link{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer}';
    document.head.append(css);
    const banner = document.createElement('div');
    banner.className = 'ub-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', he ? 'העדפות עוגיות' : 'Cookie preferences');
    banner.innerHTML = he
      ? '<p>אנליטיקה אופציונלית עוזרת לנו להבין איך משתמשים באתר. אפשר לסרב ולהמשיך להשתמש בכל האתר. <a href="https://www.mlaia.com/privacy.html">מדיניות הפרטיות</a></p><div class="ub-consent-actions"><button type="button" data-consent="yes">אישור אנליטיקה</button><button type="button" class="secondary" data-consent="no">סירוב</button></div>'
      : '<p>Optional analytics help us understand how the website is used. You can decline and still use every feature. <a href="https://www.mlaia.com/privacy.html">Privacy Policy</a></p><div class="ub-consent-actions"><button type="button" data-consent="yes">Accept analytics</button><button type="button" class="secondary" data-consent="no">Decline</button></div>';
    const choice = saved();
    banner.hidden = !!choice;
    document.body.append(banner);
    const choose = analytics => {
      try { localStorage.setItem(KEY, JSON.stringify({ necessary: true, analytics, timestamp: Date.now() })); } catch {}
      banner.hidden = true;
      if (analytics) loadGA();
    };
    banner.querySelectorAll('[data-consent]').forEach(b => b.addEventListener('click', () => choose(b.dataset.consent === 'yes')));
    banner.addEventListener('keydown', e => { if (e.key === 'Escape') choose(false); });
    const footerLinks = document.querySelector('.ub-footer p:last-child');
    if (footerLinks) {
      const settings = document.createElement('button');
      settings.type = 'button';
      settings.className = 'ub-cookie-link';
      settings.textContent = he ? 'הגדרות עוגיות' : 'Cookie settings';
      settings.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });
      footerLinks.append(' · ', settings);
    }
    if (choice && choice.analytics === true) loadGA();
  }
  document.querySelectorAll('a[href*="talk.mlaia.com"]').forEach(a => a.addEventListener('click', () => track('demo_click', { link_url: a.href })));
  document.addEventListener('ub-form-sent', e => track('generate_lead', { topic: e.detail.topic }));
})();
