// Main app — workspace shell, sidebar, tab bar, status bar.

const { useState: useS, useEffect: useE, useRef: useR, useCallback: useCB } = React;

// File-icon glyphs — original, simple shapes.
function FileIcon({ kind }) {
  const color =
    kind === "md" ? "var(--icon-md)" :
    kind === "json" ? "var(--icon-json)" :
    kind === "ts" ? "var(--icon-ts)" :
    "var(--fg-dim)";
  const label =
    kind === "md" ? "M" :
    kind === "json" ? "{ }" :
    kind === "ts" ? "TS" : "·";
  return (
    <span className="file-icon" style={{ color }}>{label}</span>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg className={"chev " + (open ? "open" : "")} width="10" height="10" viewBox="0 0 10 10">
      <path d="M3 2 L7 5 L3 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseX() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Sidebar({ files, activeId, onOpen, collapsed, onToggleCollapse }) {
  const [folderOpen, setFolderOpen] = useS(true);

  return (
    <aside className={"sidebar" + (collapsed ? " sidebar-collapsed" : "")}>
      <div className="sidebar-header">
        <span className="sidebar-title">EXPLORER</span>
        <button className="icon-btn" onClick={onToggleCollapse} aria-label="Collapse sidebar" title="Collapse sidebar">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 2 L4 6 L8 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="sidebar-tree">
        <button className="folder-row" onClick={() => setFolderOpen(!folderOpen)}>
          <ChevronIcon open={folderOpen} />
          <span className="folder-name">kelvinbenson.com</span>
        </button>
        {folderOpen && (
          <ul className="file-list">
            {files.map((f) => (
              <li key={f.id}>
                <button
                  className={"file-row" + (activeId === f.id ? " file-row-active" : "")}
                  onClick={() => onOpen(f.id)}
                >
                  <FileIcon kind={f.icon} />
                  <span className="file-name">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="sidebar-spacer" />
        <div className="sidebar-footer">
          <div className="sidebar-footer-row">
            <span className="dot dot-live" /> available
          </div>
          <div className="sidebar-footer-row muted">last edit · 2 days ago</div>
        </div>
      </div>
    </aside>
  );
}

function TabBar({ openTabs, activeId, onActivate, onClose }) {
  return (
    <div className="tab-bar" role="tablist">
      {openTabs.map((f) => (
        <div
          key={f.id}
          role="tab"
          aria-selected={activeId === f.id}
          className={"tab" + (activeId === f.id ? " tab-active" : "")}
          onClick={() => onActivate(f.id)}
        >
          <FileIcon kind={f.icon} />
          <span className="tab-name">{f.name}</span>
          <button
            className="tab-close"
            onClick={(e) => { e.stopPropagation(); onClose(f.id); }}
            aria-label={"Close " + f.name}
          >
            <CloseX />
          </button>
        </div>
      ))}
      <div className="tab-bar-fill" />
    </div>
  );
}

function Breadcrumb({ file }) {
  if (!file) return <div className="breadcrumb" />;
  return (
    <div className="breadcrumb">
      <span>kelvinbenson.com</span>
      <span className="crumb-sep">/</span>
      <FileIcon kind={file.icon} />
      <span className="crumb-file">{file.name}</span>
    </div>
  );
}

function StatusBar({ activeFile, theme, onCmdK, terminalOpen, onToggleTerminal }) {
  const lineCount = activeFile ? (
    activeFile.type === "commits" ? activeFile.commits.length :
    activeFile.type === "json" ? Object.values(activeFile.skills).flat().length :
    activeFile.type === "languages" ? (activeFile.spoken || []).length + (activeFile.written || []).length + 10 :
    activeFile.type === "certifications" ? (activeFile.certs || []).length :
    ("code" in activeFile) ? (activeFile.code || "").split("\n").length + (activeFile.body || "").split("\n").length :
    (activeFile.body || "").split("\n").length
  ) : 0;
  const langLabel =
    !activeFile ? "—" :
    (activeFile.type === "md" || "code" in activeFile) ? "Markdown" :
    activeFile.type === "languages" ? "TypeScript" :
    activeFile.type === "certifications" ? "Markdown" :
    activeFile.type === "json" ? "JSON" :
    activeFile.type === "ts" ? "TypeScript" :
    activeFile.type === "commits" ? "Git Log" : "Plain";

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-pill">
          <svg width="11" height="11" viewBox="0 0 12 12"><circle cx="6" cy="6" r="2.5" fill="currentColor"/><path d="M6 1 L6 3.5 M6 8.5 L6 11" stroke="currentColor" strokeWidth="1.2"/></svg>
          main
        </span>
        <span className="status-item">⇣ 0   ⇡ 2</span>
        <span className="status-item">UTF-8</span>
        <span className="status-item">{langLabel}</span>
      </div>
      <div className="status-right">
        <button className="status-item status-btn" onClick={onToggleTerminal}>
          {terminalOpen ? "Hide terminal" : "Show terminal"} ⌃`
        </button>
        <button className="status-item status-btn" onClick={onCmdK}>
          ⌘K
        </button>
        <span className="status-item">Ln {lineCount}, Col 1</span>
        <span className="status-item">Spaces: 2</span>
        <span className="status-item">{theme === "light" ? "Light" : "Dark"}</span>
      </div>
    </div>
  );
}

// Command palette
function CommandPalette({ open, onClose, files, onOpen, onSetTheme, onToggleTerminal }) {
  const [q, setQ] = useS("");
  const inputRef = useR(null);
  useE(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
    }
  }, [open]);

  const items = [
    ...files.map((f) => ({
      id: "open:" + f.id,
      label: f.name,
      hint: "Open file",
      action: () => { onOpen(f.id); onClose(); }
    })),
    { id: "theme:dark", label: "Theme: Dark", hint: "Switch theme", action: () => { onSetTheme("dark"); onClose(); } },
    { id: "theme:light", label: "Theme: Light", hint: "Switch theme", action: () => { onSetTheme("light"); onClose(); } },
    { id: "term:toggle", label: "Toggle terminal", hint: "View", action: () => { onToggleTerminal(); onClose(); } },
  ];
  const filtered = q
    ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
    : items;

  if (!open) return null;
  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Type a file name or command…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && filtered[0]) filtered[0].action();
          }}
        />
        <ul className="palette-list">
          {filtered.slice(0, 8).map((i, idx) => (
            <li key={i.id} className={"palette-item" + (idx === 0 ? " palette-item-first" : "")} onClick={i.action}>
              <span>{i.label}</span>
              <span className="palette-hint">{i.hint}</span>
            </li>
          ))}
          {filtered.length === 0 && <li className="palette-empty">No matches.</li>}
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// Root
// ============================================================
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "dark",
    "accent": "lime",
    "showTerminal": true,
    "typingAnim": true,
    "showLineNumbers": true,
    "density": "comfy",
    "sidebarCollapsed": false
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const setTweaks = (obj) => { Object.entries(obj).forEach(([k, v]) => setTweak(k, v)); };

  const files = window.PORTFOLIO_FILES;
  const [openTabIds, setOpenTabIds] = useS(["professional-summary", "work-history", "contact"]);
  const [activeId, setActiveId] = useS("professional-summary");
  const [paletteOpen, setPaletteOpen] = useS(false);
  const [typingKey, setTypingKey] = useS(0); // bumps to retrigger typing on tab switch
  const mNavDirRef = useR('m-fade');
  const mNavOverrideRef = useR(false);

  const openFile = useCB((id) => {
    if (!mNavOverrideRef.current) mNavDirRef.current = 'm-fade';
    mNavOverrideRef.current = false;
    setOpenTabIds((prev) => prev.includes(id) ? prev : [...prev, id]);
    setActiveId(id);
    setTypingKey((k) => k + 1);
  }, []);

  const closeTab = useCB((id) => {
    setOpenTabIds((prev) => {
      const next = prev.filter((x) => x !== id);
      if (id === activeId) {
        const fallback = next[next.length - 1] || null;
        setActiveId(fallback);
      }
      return next;
    });
  }, [activeId]);

  // Keyboard shortcuts
  useE(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (e.key === "k" || e.key === "p")) {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") setPaletteOpen(false);
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setTweaks({ showTerminal: !tweaks.showTerminal });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tweaks.showTerminal]);

  const activeFile = files.find((f) => f.id === activeId);
  const openTabs = openTabIds.map((id) => files.find((f) => f.id === id)).filter(Boolean);

  // Mobile / tablet detection
  const isMobile = window.useMediaQuery("(max-width: 767px)");
  const isTablet = window.useMediaQuery("(min-width: 768px) and (max-width: 1099px)");
  const [mFileSheetOpen, setMFileSheetOpen] = useS(false);
  const [mTermOpen, setMTermOpen] = useS(false);

  const navByOffset = useCB((delta) => {
    mNavDirRef.current = delta > 0 ? 'm-slide-fwd' : 'm-slide-back';
    mNavOverrideRef.current = true;
    const idx = files.findIndex((f) => f.id === activeId);
    const next = files[(idx + delta + files.length) % files.length];
    if (next) openFile(next.id);
  }, [activeId, files]);

  // Apply theme + accent via data attributes
  useE(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    document.documentElement.setAttribute("data-accent", tweaks.accent);
    document.documentElement.setAttribute("data-density", tweaks.density);
    document.documentElement.setAttribute("data-gutter", tweaks.showLineNumbers ? "on" : "off");
    document.documentElement.setAttribute("data-shell", isMobile ? "mobile" : isTablet ? "tablet" : "desktop");
  }, [tweaks.theme, tweaks.accent, tweaks.density, tweaks.showLineNumbers, isMobile, isTablet]);

  // ── Mobile shell ────────────────────────────────────────────
  if (isMobile) {
    const fileIdx = files.findIndex((f) => f.id === activeId);
    return (
      <div className="mworkspace" data-screen-label="Editor Portfolio (Mobile)">
        <window.MobileTopBar
          file={activeFile}
          theme={tweaks.theme}
          onMenu={() => setMFileSheetOpen(true)}
          onCmd={() => setPaletteOpen(true)}
          onTheme={() => setTweaks({ theme: tweaks.theme === "dark" ? "light" : "dark" })}
        />
        <window.MobileTabStrip
          openTabs={openTabs}
          activeId={activeId}
          onActivate={(id) => { setActiveId(id); setTypingKey((k) => k + 1); }}
          onClose={closeTab}
        />
        <main className={"meditor " + mNavDirRef.current} key={activeId}>
          {activeFile ? (
            <div className="meditor-pane">
              <div className="meditor-filehead">
                <span className={"file-icon mfile-icon-" + activeFile.icon}>
                  {activeFile.icon === "md" ? "M" : activeFile.icon === "json" ? "{ }" : "TS"}
                </span>
                <span className="meditor-filename">{activeFile.name}</span>
                <span className="meditor-lang">
                  {activeFile.type === "md" ? "Markdown" : activeFile.type === "json" ? "JSON" : activeFile.type === "ts" ? "TypeScript" : "Git Log"}
                </span>
              </div>
              <window.FileBody key={activeFile.id + "-" + typingKey} file={activeFile} typing={tweaks.typingAnim} />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-glyph" />
              <h2>No file open</h2>
              <p>Tap the menu to pick a file.</p>
            </div>
          )}
        </main>
        <window.MobileBottomBar
          onTerminal={() => setMTermOpen(true)}
          onPrev={() => navByOffset(-1)}
          onNext={() => navByOffset(1)}
          fileIdx={fileIdx >= 0 ? fileIdx : 0}
          fileCount={files.length}
        />

        <window.BottomSheet
          open={mFileSheetOpen}
          onClose={() => setMFileSheetOpen(false)}
          title="Files"
          height="78vh"
        >
          <window.MobileFileList
            files={files}
            activeId={activeId}
            onOpen={(id) => { openFile(id); setMFileSheetOpen(false); }}
          />
        </window.BottomSheet>

        <window.BottomSheet
          open={mTermOpen}
          onClose={() => setMTermOpen(false)}
          title="Terminal"
          height="68vh"
        >
          <div className="mterm-wrap">
            <window.TerminalPanel
              visible={true}
              onOpenFile={(id) => { openFile(id); setMTermOpen(false); }}
              onSetTheme={(t) => setTweaks({ theme: t })}
              accent={tweaks.accent}
            />
          </div>
        </window.BottomSheet>

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          files={files}
          onOpen={openFile}
          onSetTheme={(t) => setTweaks({ theme: t })}
          onToggleTerminal={() => setMTermOpen(true)}
        />

        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Theme">
            <window.TweakRadio label="Mode" value={tweaks.theme}
              options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]}
              onChange={(v) => setTweaks({ theme: v })} />
            <window.TweakRadio label="Accent" value={tweaks.accent}
              options={[{ value: "lime", label: "Lime" }, { value: "blue", label: "Blue" }, { value: "amber", label: "Amber" }, { value: "violet", label: "Violet" }]}
              onChange={(v) => setTweaks({ accent: v })} />
          </window.TweakSection>
          <window.TweakSection label="Behavior">
            <window.TweakToggle label="Typing animation" value={tweaks.typingAnim}
              onChange={(v) => setTweaks({ typingAnim: v })} />
            <window.TweakToggle label="Line numbers" value={tweaks.showLineNumbers}
              onChange={(v) => setTweaks({ showLineNumbers: v })} />
          </window.TweakSection>
        </window.TweaksPanel>
      </div>
    );
  }

  // ── Desktop / tablet shell ──────────────────────────────────
  return (
    <div className="workspace" data-screen-label="Editor Portfolio">
      {/* Title bar */}
      <header className="title-bar">
        <div className="title-bar-left">
          <div className="window-dots" aria-hidden="true">
            <span className="dot-r" />
            <span className="dot-y" />
            <span className="dot-g" />
          </div>
          <div className="logo-mark">
            <span className="logo-glyph" />
            <span className="logo-text">workspace</span>
          </div>
        </div>
        <div className="title-bar-center">
          <button className="omnibar" onClick={() => setPaletteOpen(true)}>
            <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M7.5 7.5 L10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span>kelvinbenson.com</span>
            <span className="kbd">⌘K</span>
          </button>
        </div>
        <div className="title-bar-right">
          <button
            className="theme-toggle"
            onClick={() => setTweaks({ theme: tweaks.theme === "dark" ? "light" : "dark" })}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {tweaks.theme === "dark" ? "◐" : "◑"}
          </button>
        </div>
      </header>

      <div className="workspace-body">
        <Sidebar
          files={files}
          activeId={activeId}
          onOpen={openFile}
          collapsed={tweaks.sidebarCollapsed}
          onToggleCollapse={() => setTweaks({ sidebarCollapsed: !tweaks.sidebarCollapsed })}
        />

        <main className="editor">
          <TabBar
            openTabs={openTabs}
            activeId={activeId}
            onActivate={(id) => { setActiveId(id); setTypingKey((k) => k + 1); }}
            onClose={closeTab}
          />
          <Breadcrumb file={activeFile} />
          <div className="editor-pane">
            {activeFile ? (
              <window.FileBody key={activeFile.id + "-" + typingKey} file={activeFile} typing={tweaks.typingAnim} />
            ) : (
              <div className="empty-state">
                <div className="empty-glyph" />
                <h2>No file open</h2>
                <p>Pick a file from the sidebar, or hit <span className="kbd">⌘K</span> to search.</p>
              </div>
            )}
          </div>

          {tweaks.showTerminal && (
            <window.TerminalPanel
              visible={tweaks.showTerminal}
              onOpenFile={openFile}
              onSetTheme={(t) => setTweaks({ theme: t })}
              accent={tweaks.accent}
            />
          )}
        </main>
      </div>

      <StatusBar
        activeFile={activeFile}
        theme={tweaks.theme}
        onCmdK={() => setPaletteOpen(true)}
        terminalOpen={tweaks.showTerminal}
        onToggleTerminal={() => setTweaks({ showTerminal: !tweaks.showTerminal })}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        files={files}
        onOpen={openFile}
        onSetTheme={(t) => setTweaks({ theme: t })}
        onToggleTerminal={() => setTweaks({ showTerminal: !tweaks.showTerminal })}
      />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Theme">
          <window.TweakRadio
            label="Mode"
            value={tweaks.theme}
            options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]}
            onChange={(v) => setTweaks({ theme: v })}
          />
          <window.TweakRadio
            label="Accent"
            value={tweaks.accent}
            options={[
              { value: "lime", label: "Lime" },
              { value: "blue", label: "Blue" },
              { value: "amber", label: "Amber" },
              { value: "violet", label: "Violet" },
            ]}
            onChange={(v) => setTweaks({ accent: v })}
          />
        </window.TweakSection>
        <window.TweakSection label="Layout">
          <window.TweakRadio
            label="Density"
            value={tweaks.density}
            options={[{ value: "comfy", label: "Comfy" }, { value: "compact", label: "Compact" }]}
            onChange={(v) => setTweaks({ density: v })}
          />
          <window.TweakToggle
            label="Show line numbers"
            value={tweaks.showLineNumbers}
            onChange={(v) => setTweaks({ showLineNumbers: v })}
          />
          <window.TweakToggle
            label="Collapse sidebar"
            value={tweaks.sidebarCollapsed}
            onChange={(v) => setTweaks({ sidebarCollapsed: v })}
          />
        </window.TweakSection>
        <window.TweakSection label="Behavior">
          <window.TweakToggle
            label="Show terminal"
            value={tweaks.showTerminal}
            onChange={(v) => setTweaks({ showTerminal: v })}
          />
          <window.TweakToggle
            label="Typing animation on file open"
            value={tweaks.typingAnim}
            onChange={(v) => setTweaks({ typingAnim: v })}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
