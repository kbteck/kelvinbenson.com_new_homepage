// Terminal panel — fake shell with a few useful commands.

const { useState: useTermState, useEffect: useTermEffect, useRef: useTermRef } = React;

const TERM_PROMPT = "kelvin@portfolio:~$";

const TERM_COMMANDS = {
  help: () => [
    "available commands:",
    "  whoami        about me, in one paragraph",
    "  skills        list top skills",
    "  contact       contact details",
    "  ls            list files in this workspace",
    "  open <file>   open a file in the editor",
    "  theme <d|l>   switch theme (dark|light)",
    "  clear         clear the terminal",
    "  help          this list",
  ],
  whoami: () => [
    "kelvin benson — agile pm, software consultant, founder.",
    "10+ years shipping software with humans. currently fractional",
    "delivery for early-stage saas. open to consulting and coaching.",
  ],
  skills: () => [
    "delivery     ████████████████████  agile, roadmapping, okrs",
    "technical    ███████████████░░░░░  ts/react, sql, system design",
    "tools        ███████████████████░  linear, jira, notion, figma",
    "soft         ████████████████████  coaching, facilitation, comms",
  ],
  contact: () => [
    "email     hello@kelvinbenson.com",
    "site      kelvinbenson.com",
    "linkedin  linkedin.com/in/kelvinbenson",
    "github    github.com/kelvinbenson",
  ],
  ls: () => {
    return window.PORTFOLIO_FILES.map((f) => f.name).join("  ").match(/.{1,72}(\s|$)/g) || [];
  },
};

function TerminalPanel({ visible, onOpenFile, onSetTheme, accent }) {
  const [history, setHistory] = useTermState([
    { kind: "out", text: "portfolio shell v1.4.0 — type `help` for commands." },
  ]);
  const [input, setInput] = useTermState("");
  const [cmdHistory, setCmdHistory] = useTermState([]);
  const [histIdx, setHistIdx] = useTermState(-1);
  const inputRef = useTermRef(null);
  const scrollRef = useTermRef(null);

  useTermEffect(() => {
    if (visible && inputRef.current) inputRef.current.focus();
  }, [visible]);

  useTermEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const run = (raw) => {
    const cmd = raw.trim();
    const next = [...history, { kind: "cmd", text: cmd }];
    if (!cmd) {
      setHistory(next);
      return;
    }
    const [name, ...args] = cmd.split(/\s+/);
    let lines = [];
    if (name === "clear") {
      setHistory([]);
      return;
    } else if (name === "open") {
      const target = args[0];
      const file = window.PORTFOLIO_FILES.find(
        (f) => f.name === target || f.id === target || f.name.replace(/\..+$/, "") === target
      );
      if (file) {
        onOpenFile(file.id);
        lines = ["opening " + file.name + "..."];
      } else {
        lines = ["open: file not found: " + (target || "(none)")];
      }
    } else if (name === "theme") {
      const t = args[0];
      if (t === "d" || t === "dark") { onSetTheme("dark"); lines = ["theme → dark"]; }
      else if (t === "l" || t === "light") { onSetTheme("light"); lines = ["theme → light"]; }
      else lines = ["usage: theme <dark|light>"];
    } else if (TERM_COMMANDS[name]) {
      lines = TERM_COMMANDS[name](args);
    } else {
      lines = ["command not found: " + name + ". try `help`."];
    }
    setHistory([...next, ...lines.map((l) => ({ kind: "out", text: l }))]);
    setCmdHistory([cmd, ...cmdHistory].slice(0, 30));
    setHistIdx(-1);
  };

  const onKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = Math.min(histIdx + 1, cmdHistory.length - 1);
      if (cmdHistory[ni] !== undefined) {
        setInput(cmdHistory[ni]);
        setHistIdx(ni);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni);
      setInput(ni === -1 ? "" : cmdHistory[ni]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const all = ["help", "whoami", "skills", "contact", "ls", "open", "theme", "clear"];
      const match = all.find((c) => c.startsWith(input.trim()));
      if (match) setInput(match + " ");
    }
  };

  if (!visible) return null;

  return (
    <div className="terminal" onClick={() => inputRef.current && inputRef.current.focus()}>
      <div className="terminal-header">
        <span className="terminal-title">TERMINAL</span>
        <span className="terminal-tag">zsh — kelvin@portfolio</span>
      </div>
      <div className="terminal-body" ref={scrollRef}>
        {history.map((h, i) => (
          h.kind === "cmd" ? (
            <div key={i} className="term-line term-cmd">
              <span className="term-prompt" style={{ color: "var(--accent)" }}>{TERM_PROMPT}</span>
              <span className="term-text">{h.text}</span>
            </div>
          ) : (
            <div key={i} className="term-line term-out">{h.text}</div>
          )
        ))}
        <div className="term-line term-input-line">
          <span className="term-prompt" style={{ color: "var(--accent)" }}>{TERM_PROMPT}</span>
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
          />
          <span className="term-caret" />
        </div>
      </div>
    </div>
  );
}

window.TerminalPanel = TerminalPanel;
