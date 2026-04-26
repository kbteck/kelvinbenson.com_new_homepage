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
  const categories = Object.keys(skills);
  let lineNum = 1;
  const linesOut = [];

  const faint  = { color: "var(--fg-faint)" };
  const dim    = { color: "var(--fg-dim)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase" };
  const normal = { color: "var(--fg)", minWidth: "200px", display: "inline-block" };
  const num    = { color: "var(--fg-dim)", fontSize: "11px", minWidth: "26px", textAlign: "right" };

  linesOut.push({ n: lineNum++, content: <span style={faint}>{"{"}</span> });
  linesOut.push({ n: lineNum++, content: null });

  categories.forEach((cat, ci) => {
    linesOut.push({
      n: lineNum++,
      indent: 1,
      content: <span style={dim}>{cat}</span>
    });
    skills[cat].forEach((s) => {
      linesOut.push({
        n: lineNum++,
        indent: 2,
        content: (
          <span className="skill-line">
            <span style={normal}>{s.name}</span>
            <span className="skill-bar" aria-hidden="true">
              <span className="skill-bar-fill" style={{ width: s.level + "%" }} />
            </span>
            <span style={num}>{s.level}</span>
          </span>
        )
      });
    });
    if (ci < categories.length - 1) linesOut.push({ n: lineNum++, content: null });
  });

  linesOut.push({ n: lineNum++, content: null });
  linesOut.push({ n: lineNum++, content: <span style={faint}>{"}"}</span> });

  return (
    <div className="code-view">
      <LineGutter count={linesOut.length} />
      <pre className="code-pre">
        {linesOut.map((l) => (
          <div key={l.n} className="code-line" style={{ paddingLeft: (l.indent || 0) * 16 }}>
            {l.content || " "}
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

function LanguagesView({ file }) {
  const spoken = file.spoken || [];
  const written = file.written || [];
  let lineNum = 1;
  const lines = [];

  const nameCol    = { display: "inline-block", minWidth: "124px", color: "var(--fg)" };
  const wNameCol   = { display: "inline-block", minWidth: "124px", color: "var(--fg-strong)", fontWeight: 600 };
  const levelCol   = { fontSize: "11px", color: "var(--tok-string)",  letterSpacing: "0.03em" };
  const usageCol   = { fontSize: "11px", color: "var(--tok-comment)", letterSpacing: "0.03em" };

  lines.push({ n: lineNum++, content: <span className="tok tok-comment">{"// spoken"}</span> });
  lines.push({ n: lineNum++, content: null });
  spoken.forEach(lang => {
    lines.push({
      n: lineNum++, indent: 1,
      content: (
        <span className="skill-line">
          <span style={nameCol}>{lang.name}</span>
          <span className="skill-bar"><span className="skill-bar-fill" style={{ width: lang.pct + "%" }} /></span>
          <span style={levelCol}>{lang.level}</span>
        </span>
      )
    });
  });

  lines.push({ n: lineNum++, content: null });
  lines.push({ n: lineNum++, content: <span className="tok tok-comment">{"// written"}</span> });
  lines.push({ n: lineNum++, content: null });
  written.forEach(lang => {
    lines.push({
      n: lineNum++, indent: 1,
      content: (
        <span className="skill-line">
          <span style={wNameCol}>{lang.name}</span>
          <span className="skill-bar"><span className="skill-bar-fill" style={{ width: lang.pct + "%", background: "var(--tok-fn)" }} /></span>
          <span style={usageCol}>{lang.usage}</span>
        </span>
      )
    });
  });

  lines.push({ n: lineNum++, content: null });
  lines.push({ n: lineNum++, content: null });
  [
    "/*",
    " * The first set is for the clients. The second is for the",
    " * engineers I work with — speaking their language earns",
    " * trust faster than any certification.",
    " */"
  ].forEach(t => lines.push({ n: lineNum++, content: <span className="tok tok-comment">{t}</span> }));

  return (
    <div className="code-view" style={{ paddingBottom: "140px" }}>
      <LineGutter count={lines.length} />
      <pre className="code-pre">
        {lines.map(l => (
          <div key={l.n} className="code-line" style={{ paddingLeft: (l.indent || 0) * 16 }}>
            {l.content || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}

function AnimatedMdView({ file, typing }) {
  const codeSrc = file.code || "";
  const [displayed, setDisplayed] = useState(typing ? "" : codeSrc);
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!typing) { setDisplayed(codeSrc); return; }
    setDisplayed("");
    const total = codeSrc.length;
    const start = performance.now();
    const tick = (t) => {
      const i = Math.min(total, Math.floor((t - start) / 1000 * 28));
      setDisplayed(codeSrc.slice(0, i));
      if (i < total) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [codeSrc, typing]);

  const isDone = !typing || displayed.length >= codeSrc.length;
  const bodyMd = useMemo(() => window.renderMarkdown(file.body || ""), [file.body]);
  const lineCount = Math.max(
    2 + codeSrc.split("\n").length + (file.body || "").split("\n").length, 1
  );

  return (
    <div className="md-view" style={{ paddingBottom: "140px" }}>
      <LineGutter count={lineCount} />
      <div className="md-body">
        <h1 className="md-h md-h1">{file.heading}</h1>
        <pre className="md-pre ed-green">
          <code>
            {displayed}
            {!isDone && <span className="ed-cursor" />}
            <span aria-hidden="true" style={{ opacity: 0, userSelect: "none", pointerEvents: "none" }}>
              {codeSrc.slice(displayed.length)}
            </span>
          </code>
        </pre>
        {bodyMd}
      </div>
    </div>
  );
}

function CertificationsView({ file }) {
  const certs = file.certs || [];
  const noteHtml = useMemo(() => file.note ? window.renderMarkdown(file.note) : null, [file.note]);
  return (
    <div style={{ padding: "28px 28px 140px" }}>
      <div style={{ marginBottom: "20px" }}>
        <span className="tok tok-comment">{"// " + certs.length + " verified certifications"}</span>
      </div>
      <div className="cert-grid">
        {certs.map(cert => (
          <div key={cert.id} className="cert-card">
            <div className="cert-badge-wrap">
              {cert.imageUrl
                ? <img src={cert.imageUrl} alt={cert.name} className="cert-badge-img" />
                : <div className="cert-badge-fallback">{cert.abbr}</div>
              }
            </div>
            <div className="cert-name">{cert.name}</div>
            <div className="cert-issuer">{cert.issuer}</div>
            <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="cert-verify">
              {"verify →"}
            </a>
          </div>
        ))}
      </div>
      {noteHtml && (
        <div style={{ marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
          <div className="md-body">{noteHtml}</div>
        </div>
      )}
    </div>
  );
}

function FileBody({ file, typing }) {
  const typedTs = useTypedSrc(file.type === "ts" ? file.body : "", typing && file.type === "ts");
  if (file.type === "md") return <MarkdownView src={file.body} />;
  if (file.type === "ts") return <CodeView src={typing ? typedTs : file.body} lang="ts" />;
  if (file.type === "json") return <JSONSkillsView skills={file.skills} />;
  if (file.type === "commits") return <CommitsView commits={file.commits} consulting={file.consulting} />;
  if (file.type === "languages") return <LanguagesView file={file} />;
  if (file.type === "certifications") return <CertificationsView file={file} />;
  if ("code" in file) return <AnimatedMdView file={file} typing={typing} />;
  return <div className="muted">Unsupported file type.</div>;
}

window.FileBody = FileBody;
