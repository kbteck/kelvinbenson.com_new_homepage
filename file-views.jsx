// Renders the body of a single "file" — markdown / json / ts / commits.
// Exposes <FileBody file={...} typing={bool} />.

(function () {
  const s = document.createElement("style");
  s.textContent = `
    .consulting-tag {
      transition: box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease;
      cursor: default;
    }
    .consulting-tag:hover {
      box-shadow: 0 0 10px var(--accent), 0 0 2px var(--accent);
      background: color-mix(in srgb, var(--accent) 22%, transparent);
      color: #fff;
    }
  `;
  document.head.appendChild(s);
})();

const { useState, useEffect, useMemo, useRef } = React;

function LineGutter({ count }) {
  const lines = [];
  for (let i = 1; i <= count; i++) lines.push(i);
  return (
    <div className="line-gutter" aria-hidden="true">
      {lines.map((n) => <div key={n} className="line-num">{n}</div>)}
    </div>
  );
}

// Generic syntax-highlighted display for ts / json
function CodeView({ src, lang }) {
  const lines = useMemo(
    () => (lang === "json" ? window.SyntaxHL.json(src) : window.SyntaxHL.ts(src)),
    [src, lang]
  );
  return (
    <div className="code-view">
      <LineGutter count={lines.length} />
      <pre className="code-pre">
        {lines.map((toks, idx) => (
          <div key={idx} className="code-line">
            {toks.length === 0 ? "\u00A0" : toks.map((t, ti) => (
              <span key={ti} className={"tok tok-" + t.t}>{t.v}</span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}

// Markdown rendered as a "preview pane" — but with line numbers in the gutter
function MarkdownView({ src }) {
  const rendered = useMemo(() => window.renderMarkdown(src), [src]);
  // Approximate line count from source so the gutter feels right
  const lineCount = Math.max(src.split("\n").length, 1);
  return (
    <div className="md-view" style={{ paddingBottom: "140px" }}>
      <LineGutter count={lineCount} />
      <div className="md-body">{rendered}</div>
    </div>
  );
}

function JSONSkillsView({ skills }) {
  // Render real JSON-looking text with bars overlaid on each "level" value.
  const categories = Object.keys(skills);
  let lineNum = 1;
  const linesOut = [];
  linesOut.push({ n: lineNum++, content: <><span className="tok tok-punct">{"{"}</span></> });
  categories.forEach((cat, ci) => {
    linesOut.push({
      n: lineNum++,
      indent: 1,
      content: (
        <>
          <span className="tok tok-key">"{cat}"</span>
          <span className="tok tok-punct">: [</span>
        </>
      )
    });
    skills[cat].forEach((s, si) => {
      const last = si === skills[cat].length - 1;
      linesOut.push({
        n: lineNum++,
        indent: 2,
        content: (
          <span className="skill-line">
            <span className="tok tok-punct">{"{ "}</span>
            <span className="tok tok-key">"name"</span>
            <span className="tok tok-punct">: </span>
            <span className="tok tok-string">"{s.name}"</span>
            <span className="tok tok-punct">, </span>
            <span className="tok tok-key">"level"</span>
            <span className="tok tok-punct">: </span>
            <span className="tok tok-number">{s.level}</span>
            <span className="tok tok-punct">{" }"}{last ? "" : ","}</span>
            <span className="skill-bar" aria-hidden="true">
              <span className="skill-bar-fill" style={{ width: s.level + "%" }} />
            </span>
          </span>
        )
      });
    });
    linesOut.push({
      n: lineNum++,
      indent: 1,
      content: <span className="tok tok-punct">]{ci === categories.length - 1 ? "" : ","}</span>
    });
  });
  linesOut.push({ n: lineNum++, content: <span className="tok tok-punct">{"}"}</span> });

  return (
    <div className="code-view">
      <LineGutter count={linesOut.length} />
      <pre className="code-pre">
        {linesOut.map((l) => (
          <div key={l.n} className="code-line" style={{ paddingLeft: (l.indent || 0) * 16 }}>
            {l.content}
          </div>
        ))}
      </pre>
    </div>
  );
}

function CommitsView({ commits, consulting }) {
  return (
    <div className="commits-view">
      <div className="commits-header">
        <span className="commit-tag">Most recent</span>{"  Work.history.md"}
        <br />
        <span className="tok tok-comment">$ git log --pretty=oneline --decorate</span>
      </div>
      <div className="commits-list">
        {commits.map((c, idx) => (
          <div key={c.hash} className="commit">
            <div className="commit-graph">
              <span className={"commit-dot" + (idx === 0 ? " commit-dot-head" : "")} />
              {idx < commits.length - 1 && <span className="commit-line" />}
            </div>
            <div className="commit-body">
              <div className="commit-meta">
                <span className="commit-hash">{c.hash}</span>
                <span className="commit-date">{c.date}</span>
                <span className="commit-author">@{c.author}</span>
                {idx === 0 && <span className="commit-tag">HEAD → main</span>}
              </div>
              <div className="commit-title">{c.title}</div>
              <pre className="commit-msg">{c.body}</pre>
            </div>
          </div>
        ))}
      </div>
      {consulting && (
        <div style={{ marginTop: "40px", borderTop: "1px solid var(--border)", paddingTop: "28px" }}>
          <div className="commits-header" style={{ marginBottom: "18px" }}>
            <span className="tok tok-comment">// also consults on</span>
          </div>
          {Object.entries(consulting).map(([category, areas]) => (
            <div key={category} style={{ marginBottom: "14px", display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", minWidth: "90px", color: "var(--fg)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{category}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {areas.map((area) => (
                  <span key={area} className="commit-tag consulting-tag">{area}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Typing animation wrapper — reveals src char-by-char.
function useTypedSrc(src, enabled) {
  const [out, setOut] = useState(enabled ? "" : src);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!enabled) {
      setOut(src);
      return;
    }
    setOut("");
    let i = 0;
    const total = src.length;
    // ~1500 chars/sec target — feels fast but visible.
    const start = performance.now();
    const tick = (t) => {
      const elapsed = t - start;
      i = Math.min(total, Math.floor((elapsed / 1000) * 1500));
      setOut(src.slice(0, i));
      if (i < total) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [src, enabled]);
  return out;
}

function FileBody({ file, typing }) {
  // Markdown / commits / json don't get character-typed (they're rendered).
  // Only ts gets the typing effect to keep things tasteful.
  const typedTs = useTypedSrc(file.type === "ts" ? file.body : "", typing && file.type === "ts");
  if (file.type === "md") return <MarkdownView src={file.body} />;
  if (file.type === "ts") return <CodeView src={typing ? typedTs : file.body} lang="ts" />;
  if (file.type === "json") return <JSONSkillsView skills={file.skills} />;
  if (file.type === "commits") return <CommitsView commits={file.commits} consulting={file.consulting} />;
  return <div className="muted">Unsupported file type.</div>;
}

window.FileBody = FileBody;
