// Mobile shell — bottom sheet file picker, swipeable tab strip,
// expandable terminal drawer. Activated at viewports < 768px.

const { useState: mUS, useEffect: mUE, useRef: mUR } = React;

function useMediaQuery(query) {
  const [match, setMatch] = mUS(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });
  mUE(() => {
    const m = window.matchMedia(query);
    const fn = (e) => setMatch(e.matches);
    m.addEventListener ? m.addEventListener("change", fn) : m.addListener(fn);
    return () => {
      m.removeEventListener ? m.removeEventListener("change", fn) : m.removeListener(fn);
    };
  }, [query]);
  return match;
}
window.useMediaQuery = useMediaQuery;

// ──────────────────────────────────────────────────────────────────
// Bottom sheet — backdrop + spring slide. Used for file picker + terminal.
// ──────────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, title, children, height = "70vh", peek = false }) {
  const sheetRef = mUR(null);
  const [dragY, setDragY] = mUS(0);
  const [dragging, setDragging] = mUS(false);
  const startY = mUR(0);

  // Lock body scroll while open
  mUE(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onPointerDown = (e) => {
    startY.current = e.clientY;
    setDragging(true);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dy = Math.max(0, e.clientY - startY.current);
    setDragY(dy);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragY > 80) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <>
      <div
        className={"sheet-backdrop" + (open ? " sheet-backdrop-open" : "")}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        ref={sheetRef}
        className={"sheet" + (open ? " sheet-open" : "")}
        style={{
          height,
          transform: open
            ? `translateY(${dragY}px)`
            : "translateY(100%)",
          transition: dragging ? "none" : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="sheet-grip-zone"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="sheet-grip" />
        </div>
        {title && (
          <div className="sheet-header">
            <span className="sheet-title">{title}</span>
            <button className="sheet-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Mobile top bar — small file glyph, current name, menu trigger
// ──────────────────────────────────────────────────────────────────
function MobileTopBar({ file, onMenu, onTheme, theme, onCmd }) {
  return (
    <header className="mtopbar">
      <button className="mtopbar-menu" onClick={onMenu} aria-label="Open file menu">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="2" y="3"  width="14" height="1.6" rx="0.8" fill="currentColor"/>
          <rect x="2" y="8.2" width="14" height="1.6" rx="0.8" fill="currentColor"/>
          <rect x="2" y="13.4" width="14" height="1.6" rx="0.8" fill="currentColor"/>
        </svg>
      </button>
      <div className="mtopbar-title">
        <span className="logo-glyph mtopbar-glyph" />
        <span className="mtopbar-path">
          Kelvin Benson
        </span>
      </div>
      <div className="mtopbar-actions">
        <button className="mtopbar-icon" onClick={onCmd} aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M10.2 10.2 L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="mtopbar-icon" onClick={onTheme} aria-label="Toggle theme">
          {theme === "dark" ? "◐" : "◑"}
        </button>
      </div>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────
// Mobile file list (inside the sheet)
// ──────────────────────────────────────────────────────────────────
function MobileFileList({ files, activeId, onOpen }) {
  // group by category — first file is "summary" pinned, rest grouped
  return (
    <div className="mfile-list">
      <div className="mfile-folder">
        <span className="mfile-folder-chev">▾</span>
        <span>kelvinbenson.com</span>
        <span className="mfile-count">{files.length}</span>
      </div>
      {files.map((f) => (
        <button
          key={f.id}
          className={"mfile" + (activeId === f.id ? " mfile-active" : "")}
          onClick={() => onOpen(f.id)}
        >
          <span className={"mfile-icon mfile-icon-" + f.icon}>
            {f.icon === "md" ? "M" : f.icon === "json" ? "{ }" : "TS"}
          </span>
          <div className="mfile-text">
            <div className="mfile-name">{f.name}</div>
            <div className="mfile-desc">{
              f.id === "professional-summary" ? "Who I am, in 90 seconds" :
              f.id === "overview" ? "The three things I do" :
              f.id === "work-history" ? "Career as commit log" :
              f.id === "education" ? "Degrees + continuing ed" :
              f.id === "skills" ? "Capabilities, JSON" :
              f.id === "professional-value" ? "Outcomes, in numbers" :
              f.id === "certifications" ? "PMP, CSM, PSPO II…" :
              f.id === "languages" ? "Spoken + written" :
              f.id === "availability" ? "Booking + capacity" :
              f.id === "contact" ? "How to reach me" : ""
            }</div>
          </div>
          {activeId === f.id && <span className="mfile-active-mark" />}
        </button>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Mobile tab strip — horizontally scrollable pills
// ──────────────────────────────────────────────────────────────────
function MobileTabStrip({ openTabs, activeId, onActivate, onClose }) {
  const stripRef = mUR(null);

  // Auto-scroll active tab into view
  mUE(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector(".mtab-active");
    if (el) {
      const left = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
      strip.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeId]);

  if (openTabs.length === 0) return null;

  return (
    <div className="mtab-strip" ref={stripRef}>
      {openTabs.map((f) => (
        <div
          key={f.id}
          className={"mtab" + (activeId === f.id ? " mtab-active" : "")}
          onClick={() => onActivate(f.id)}
        >
          <span className={"mtab-icon mfile-icon-" + f.icon}>
            {f.icon === "md" ? "M" : f.icon === "json" ? "{ }" : "TS"}
          </span>
          <span className="mtab-name">{f.name}</span>
          {openTabs.length > 1 && (
            <button
              className="mtab-close"
              onClick={(e) => { e.stopPropagation(); onClose(f.id); }}
              aria-label={"Close " + f.name}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Mobile bottom action bar — terminal + nav arrows
// ──────────────────────────────────────────────────────────────────
function MobileBottomBar({ onTerminal, onPrev, onNext, fileIdx, fileCount }) {
  return (
    <nav className="mbottom">
      <button className="mbottom-btn" onClick={onPrev} aria-label="Previous file">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M11 4 L6 9 L11 14" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="mbottom-progress">
        <span>{fileIdx + 1}</span>
        <span className="mbottom-progress-sep">/</span>
        <span className="mbottom-progress-total">{fileCount}</span>
      </div>
      <button className="mbottom-btn mbottom-term" onClick={onTerminal} aria-label="Open terminal">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M3 4 L8 9 L3 14" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span>terminal</span>
      </button>
      <button className="mbottom-btn" onClick={onNext} aria-label="Next file">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M7 4 L12 9 L7 14" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </nav>
  );
}

window.MobileTopBar = MobileTopBar;
window.MobileFileList = MobileFileList;
window.MobileTabStrip = MobileTabStrip;
window.MobileBottomBar = MobileBottomBar;
window.BottomSheet = BottomSheet;
