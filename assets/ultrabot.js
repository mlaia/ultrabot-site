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

  // Respect reduced motion for the looping avatar clips.
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
  }

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
        form.reset();
        status.textContent = he ? 'תודה. ההודעה נשלחה, ונחזור אליכם במייל.' : 'Thank you. Your message was sent. We will reply by email.';
      } catch {
        status.textContent = he ? 'לא הצלחנו לשלוח את ההודעה. נסו שוב או כתבו ל-yochai@mlaia.com.' : 'Your message could not be sent. Please try again or email yochai@mlaia.com.';
      } finally {
        button.disabled = false;
      }
    });
  }
})();
