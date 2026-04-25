// Typewriter animation for blockquote paragraphs.
// Self-contained: injects its own CSS, uses MutationObserver so it
// works automatically whenever React renders a blockquote into the DOM.

(function () {
  const style = document.createElement("style");
  style.textContent = `
    .type-cursor {
      display: inline-block;
      color: inherit;
      animation: type-blink 0.75s step-end infinite;
    }
    @keyframes type-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const CHAR_MS = 55;

  function typeEl(el) {
    if (el.dataset.typed) return;
    el.dataset.typed = "1";

    const full = el.textContent;
    el.textContent = "";

    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.textContent = "|";
    cursor.setAttribute("aria-hidden", "true");
    el.appendChild(cursor);

    let i = 0;
    (function tick() {
      if (i < full.length) {
        cursor.insertAdjacentText("beforebegin", full[i++]);
        setTimeout(tick, CHAR_MS);
      }
    })();
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll("blockquote.md-quote").forEach(typeEl);
  }

  const obs = new MutationObserver((muts) => {
    muts.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        scan(n);
        if (n.tagName === "BLOCKQUOTE" && n.classList.contains("md-quote")) typeEl(n);
      })
    );
  });

  // Observe immediately — typing.js executes after <div id="root"> exists but
  // before Babel compiles JSX, so the observer is active for React's first render.
  const root = document.getElementById("root") || document.body;
  obs.observe(root, { childList: true, subtree: true });
  scan(root);
})();
