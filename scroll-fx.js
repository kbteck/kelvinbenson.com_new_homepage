// Scroll-reveal + mobile file-switch slide transitions.
// Self-contained: injects its own CSS, uses IntersectionObserver + MutationObserver.

(function () {
  const s = document.createElement('style');
  s.textContent = `
    /* ── Scroll-reveal ────────────────────────────────────── */
    .sr { opacity: 0; transform: translateY(15px); }
    .sr.sr-in {
      animation: sr-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes sr-up {
      from { opacity: 0; transform: translateY(15px); }
      to   { opacity: 1; transform: none; }
    }

    /* ── Mobile file-switch transitions ───────────────────── */
    @keyframes m-r {
      from { opacity: 0; transform: translateX(28px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes m-l {
      from { opacity: 0; transform: translateX(-28px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes m-f {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .m-slide-fwd  { animation: m-r 0.28s cubic-bezier(.25,.46,.45,.94) both; }
    .m-slide-back { animation: m-l 0.28s cubic-bezier(.25,.46,.45,.94) both; }
    .m-fade       { animation: m-f 0.22s ease both; }
  `;
  document.head.appendChild(s);

  // ── Scroll-reveal ────────────────────────────────────────────
  // Exclude hr (decorative) and blockquote (has typing animation).
  const TARGETS = '.md-body > *:not(hr):not(blockquote), .commit';

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('sr-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  function attach(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(TARGETS).forEach(el => {
      if (el.dataset.sr) return;
      el.dataset.sr = '1';
      requestAnimationFrame(() => {
        el.classList.add('sr');
        io.observe(el);
      });
    });
  }

  const mo = new MutationObserver(muts =>
    muts.forEach(m =>
      m.addedNodes.forEach(n => { if (n.nodeType === 1) attach(n); })
    )
  );

  const root = document.getElementById('root') || document.body;
  mo.observe(root, { childList: true, subtree: true });
})();
