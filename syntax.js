// Lightweight syntax highlighter — token-based, returns React elements.
// Themes are driven by CSS variables so the theme switcher just works.

(function () {
  const TS_KEYWORDS = new Set([
    "export", "import", "from", "const", "let", "var", "function",
    "return", "if", "else", "for", "while", "interface", "type",
    "readonly", "default", "as", "new", "this", "class", "extends",
    "implements", "public", "private", "protected", "async", "await"
  ]);
  const TS_TYPES = new Set([
    "string", "number", "boolean", "void", "any", "unknown",
    "never", "object", "Contact", "ContactChannel"
  ]);
  const TS_BOOL = new Set(["true", "false", "null", "undefined"]);

  // Tokenize TS into spans. Keep it simple, not bulletproof.
  function tokenizeTS(src) {
    const tokens = [];
    let i = 0;
    const len = src.length;
    while (i < len) {
      const c = src[i];

      // Line comment
      if (c === "/" && src[i + 1] === "/") {
        let j = i;
        while (j < len && src[j] !== "\n") j++;
        tokens.push({ t: "comment", v: src.slice(i, j) });
        i = j;
        continue;
      }
      // Block comment
      if (c === "/" && src[i + 1] === "*") {
        let j = i + 2;
        while (j < len && !(src[j] === "*" && src[j + 1] === "/")) j++;
        j = Math.min(len, j + 2);
        tokens.push({ t: "comment", v: src.slice(i, j) });
        i = j;
        continue;
      }
      // String
      if (c === '"' || c === "'" || c === "`") {
        const quote = c;
        let j = i + 1;
        while (j < len && src[j] !== quote) {
          if (src[j] === "\\") j += 2;
          else j++;
        }
        j = Math.min(len, j + 1);
        tokens.push({ t: "string", v: src.slice(i, j) });
        i = j;
        continue;
      }
      // Number
      if (/[0-9]/.test(c)) {
        let j = i;
        while (j < len && /[0-9.]/.test(src[j])) j++;
        tokens.push({ t: "number", v: src.slice(i, j) });
        i = j;
        continue;
      }
      // Identifier / keyword
      if (/[A-Za-z_$]/.test(c)) {
        let j = i;
        while (j < len && /[A-Za-z0-9_$]/.test(src[j])) j++;
        const word = src.slice(i, j);
        let kind = "ident";
        if (TS_KEYWORDS.has(word)) kind = "keyword";
        else if (TS_BOOL.has(word)) kind = "bool";
        else if (TS_TYPES.has(word)) kind = "type";
        else if (/^[A-Z]/.test(word)) kind = "type";
        else if (src[j] === "(") kind = "fn";
        tokens.push({ t: kind, v: word });
        i = j;
        continue;
      }
      // Punctuation / operators / whitespace — pass-through
      let j = i;
      while (j < len && !/[A-Za-z0-9_$"'`/]/.test(src[j]) && src[j] !== "\n") j++;
      if (j === i) {
        tokens.push({ t: "plain", v: src[i] });
        i++;
      } else {
        tokens.push({ t: "punct", v: src.slice(i, j) });
        i = j;
      }
    }
    return tokens;
  }

  function tokenizeJSON(src) {
    const tokens = [];
    let i = 0;
    const len = src.length;
    while (i < len) {
      const c = src[i];
      if (c === '"') {
        let j = i + 1;
        while (j < len && src[j] !== '"') {
          if (src[j] === "\\") j += 2;
          else j++;
        }
        j = Math.min(len, j + 1);
        // peek ahead for `:` to decide key vs value
        let k = j;
        while (k < len && /\s/.test(src[k])) k++;
        const isKey = src[k] === ":";
        tokens.push({ t: isKey ? "key" : "string", v: src.slice(i, j) });
        i = j;
        continue;
      }
      if (/[0-9-]/.test(c) && (i === 0 || /[\s,:\[\{]/.test(src[i - 1]))) {
        let j = i;
        if (src[j] === "-") j++;
        while (j < len && /[0-9.]/.test(src[j])) j++;
        tokens.push({ t: "number", v: src.slice(i, j) });
        i = j;
        continue;
      }
      if (/[a-z]/.test(c)) {
        let j = i;
        while (j < len && /[a-z]/.test(src[j])) j++;
        const w = src.slice(i, j);
        tokens.push({ t: ["true", "false", "null"].includes(w) ? "bool" : "plain", v: w });
        i = j;
        continue;
      }
      tokens.push({ t: "punct", v: src[i] });
      i++;
    }
    return tokens;
  }

  function renderTokens(tokens) {
    // Split by \n so we can wrap lines for line-numbering.
    const lines = [[]];
    tokens.forEach((tok) => {
      const parts = tok.v.split("\n");
      parts.forEach((p, idx) => {
        if (idx > 0) lines.push([]);
        if (p.length) lines[lines.length - 1].push({ ...tok, v: p });
      });
    });
    return lines;
  }

  window.SyntaxHL = {
    ts: (src) => renderTokens(tokenizeTS(src)),
    json: (src) => renderTokens(tokenizeJSON(src)),
  };
})();
