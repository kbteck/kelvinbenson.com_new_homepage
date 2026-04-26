# kelvinbenson.com — Project Notes

## What this is
VS Code-style portfolio for Kelvin Benson (Agile PM / Consultant / Founder).
No build step — vanilla HTML + CDN React 18 + Babel standalone.

## File map
| File | Purpose |
|---|---|
| `index.html` | Entry point, loads all scripts in order |
| `content.js` | All portfolio page data (`window.PORTFOLIO_FILES`) |
| `app.jsx` | Main shell: Sidebar, TabBar, Breadcrumb, StatusBar, CommandPalette |
| `file-views.jsx` | Renders each file type: md, ts, json (skills), commits (work history) |
| `terminal.jsx` | Fake terminal panel |
| `mobile.jsx` | Mobile shell components |
| `tweaks-panel.jsx` | Floating settings panel |
| `styles.css` | Desktop/tablet styles |
| `mobile.css` | Mobile styles |
| `scroll-fx.js` | Scroll-reveal + mobile slide transition CSS |

## Pages (in content.js PORTFOLIO_FILES)
1. `professional-summary.md` — bio + current role
2. `overview.md` — TS block + service offerings + engagement table
3. `work-history.md` — git-log style (type: commits) + consulting tags
4. `education.md` — degree table
5. `skills.json` — skill bars by category (type: json)
6. `professional-value.md` — TS interface + capability table
7. `certifications.md` — cert list
8. `languages.md` — spoken + coding languages
9. `availability.md` — status block + engagement types
10. `contact.ts` — typed Contact interface (type: ts)

## Editing pages
- Content lives in `content.js` → `PORTFOLIO_FILES` array
- Rendering logic is in `file-views.jsx`
- Each file has a `type`: `md`, `ts`, `json`, or `commits`

## No build step
Open `index.html` directly in a browser or use a local static server.
