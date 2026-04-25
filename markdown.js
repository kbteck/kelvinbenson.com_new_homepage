// Lightweight Markdown renderer — handles the subset our content uses.
// Returns React elements via React.createElement so we can use it from JSX.

(function () {
  const h = React.createElement;

  function inline(text, keyPrefix = "i") {
    // Process: code spans, bold, italic, links — naive but safe enough.
    const parts = [];
    let rest = text;
    let key = 0;
    const push = (el) => parts.push(el);

    // Greedy regex pass: code, bold, italic
    const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/;
    while (rest.length) {
      const m = rest.match(re);
      if (!m) {
        push(rest);
        break;
      }
      if (m.index > 0) push(rest.slice(0, m.index));
      const tok = m[0];
      if (tok.startsWith("`")) {
        push(h("code", { key: keyPrefix + key++, className: "md-code" }, tok.slice(1, -1)));
      } else if (tok.startsWith("**")) {
        push(h("strong", { key: keyPrefix + key++ }, tok.slice(2, -2)));
      } else if (tok.startsWith("*")) {
        push(h("em", { key: keyPrefix + key++ }, tok.slice(1, -1)));
      } else if (tok.startsWith("[")) {
        const lm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/);
        push(h("a", { key: keyPrefix + key++, href: lm[2], target: "_blank", rel: "noreferrer" }, lm[1]));
      }
      rest = rest.slice(m.index + tok.length);
    }
    return parts;
  }

  function renderMarkdown(src) {
    const lines = src.split("\n");
    const out = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code fence
      if (line.startsWith("```")) {
        const buf = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          buf.push(lines[i]);
          i++;
        }
        i++; // skip closing fence
        out.push(h("pre", { key: key++, className: "md-pre" }, h("code", null, buf.join("\n"))));
        continue;
      }

      // Heading
      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) {
        const level = hm[1].length;
        out.push(h("h" + level, { key: key++, className: "md-h md-h" + level }, inline(hm[2], "h" + key)));
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith("> ")) {
        const buf = [];
        while (i < lines.length && lines[i].startsWith("> ")) {
          buf.push(lines[i].slice(2));
          i++;
        }
        out.push(h("blockquote", { key: key++, className: "md-quote" }, inline(buf.join(" "), "q" + key)));
        continue;
      }

      // HR
      if (/^---+\s*$/.test(line)) {
        out.push(h("hr", { key: key++, className: "md-hr" }));
        i++;
        continue;
      }

      // Table (must have header + separator)
      if (line.includes("|") && lines[i + 1] && /^[\s|:-]+$/.test(lines[i + 1])) {
        const header = line.split("|").map((s) => s.trim()).filter(Boolean);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].includes("|")) {
          rows.push(lines[i].split("|").map((s) => s.trim()).filter(Boolean));
          i++;
        }
        out.push(
          h("table", { key: key++, className: "md-table" },
            h("thead", null, h("tr", null, header.map((c, idx) => h("th", { key: idx }, c)))),
            h("tbody", null, rows.map((r, idx) => h("tr", { key: idx }, r.map((c, cidx) => h("td", { key: cidx }, inline(c, "td" + idx + cidx))))))
          )
        );
        continue;
      }

      // Unordered list
      if (/^[-*]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s+/, ""));
          i++;
        }
        out.push(h("ul", { key: key++, className: "md-ul" },
          items.map((it, idx) => h("li", { key: idx }, inline(it, "li" + idx)))));
        continue;
      }

      // Ordered list
      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, ""));
          i++;
        }
        out.push(h("ol", { key: key++, className: "md-ol" },
          items.map((it, idx) => h("li", { key: idx }, inline(it, "oli" + idx)))));
        continue;
      }

      // Blank line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // Paragraph (consume contiguous non-blank, non-special lines)
      const buf = [line];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !lines[i].startsWith("> ") &&
        !lines[i].startsWith("```") &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i]) &&
        !/^---+\s*$/.test(lines[i])
      ) {
        buf.push(lines[i]);
        i++;
      }
      out.push(h("p", { key: key++, className: "md-p" }, inline(buf.join(" "), "p" + key)));
    }

    return out;
  }

  window.renderMarkdown = renderMarkdown;
})();
