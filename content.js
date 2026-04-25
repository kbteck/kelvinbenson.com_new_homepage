// Portfolio content — realistic placeholder, easy to edit later.
// Each file maps to a "file" in the editor. type drives rendering.

window.PORTFOLIO_FILES = [
  {
    id: "professional-summary",
    name: "professional-summary.md",
    type: "md",
    icon: "md",
    body: `# Professional Summary

Agile Project Manager, software consultant, and founder with 10+ years
turning ambiguous problems into shipped product. I work at the seam of
engineering and strategy — close enough to read the code, far enough back
to see the roadmap.

I run lean delivery teams, coach product orgs out of waterfall habits,
and ship the kind of internal tools that quietly make companies faster.

> "Strong opinions about process, weakly held about which framework
> you use to implement them."

---

**Currently:** Software Project Manager @ Vawick Software — fractional PM consultancy for early-stage SaaS.
`
  },
  {
    id: "overview",
    name: "overview.md",
    type: "md",
    icon: "md",
    body: `# Overview

\`\`\`ts
const kelvin: Consultant = {
  role:      "Software Project Manager",
  company:   "Vawick Software",
  focus:     ["delivery", "coaching", "tooling"],
  mindset:   "engineering-first",
  available:  true,
};
\`\`\`

---

## 1. Ship the roadmap

I run delivery for engineering teams of \`4–25\`. The work is unglamorous:
\`sprint cadence\`, \`backlog hygiene\`, stakeholder translation. The kind
of operational discipline that compounds quietly until the team ships twice
as fast and nobody can explain why.

## 2. Coach the org

For Series A/B teams: install the **lightest process that actually works**.
I audit how decisions move, where work stalls, and what rituals are theatre.
Usually one ceremony added, two removed. Less \`Jira\`, more clarity.

## 3. Build the tools

I prototype in \`TypeScript\` when a deck would be slower. Most clients end
up with a bespoke internal dashboard they didn't know they needed — built
in a sprint, used for years.

---

> Not interested in: velocity theatre, 90-minute standups, or frameworks named after Scandinavian nouns.

---

| Engagement | Duration | Commitment |
|---|---|---|
| Fractional PM | 3–6 months | 15–25 hrs/wk |
| Delivery audit | 2 weeks | Fixed scope |
| Coaching | Ongoing | Monthly retainer |
`
  },
  {
    id: "work-history",
    name: "work-history.md",
    type: "commits",
    icon: "md",
    body: null,
    consulting: {
      "Engineering":  ["Custom Software", "SaaS", "System Design", "Business Automation"],
      "AI & Data":    ["ML", "LLM"],
      "Security":     ["Cyber Security", "PenTesting"],
      "Cloud":        ["Cloud Computing"],
      "Enterprise":   ["SAP S/4HANA (Public · Private · On-Premise)", "SAP Activate", "ERP-light Solutions"]
    },
    commits: [
      {
        hash: "f4a1c9e",
        date: "Jan 2023 — present",
        author: "kelvin",
        title: "Agile PM / Scrum Master · Vawick Consulting UG · On-Site",
        body: "Agile delivery lead for SaaS product teams. Blend coaching,\nfacilitation, and technical insight to build high-performing squads.\nEmbedded Scrum and DevOps practices across the org — optimizing\nbacklogs, workflows, and deployment pipelines. Translate roadmap\nitems into shipped product aligned with business goals."
      },
      {
        hash: "b72e05d",
        date: "Nov 2019 — Jul 2022",
        author: "kelvin",
        title: "Project Manager · PS Trade GmbH · Nassau",
        body: "Led business concept development and cross-departmental project\ncoordination at a Nassau-based trade firm. Managed digital and\nsocial media initiatives end-to-end. Built forecasts, tracked\nKPIs, and redesigned project reporting in direct partnership\nwith leadership — enabling data-driven decision-making."
      }
    ]
  },
  {
    id: "education",
    name: "education.md",
    type: "md",
    icon: "md",
    body: `# Education

\`\`\`ts
const degrees   = 4;
const countries = ["Germany", "Spain", "UK (Remote)", "Nigeria"];
const span      = "2003 – 2021";
\`\`\`

---

| Institution | Degree | Period |
|---|---|---|
| CBS International Business School · Cologne | BA — International Business | 2016 – 2019 |
| TBS Education · Barcelona | BA — Digital Marketing *(Exchange)* | Jun – Dec 2018 |
| Renewable Energy Institute · UK | Galileo Master Cert — Project Management | 2020 – 2021 |
| University of Ibadan · Nigeria | BSc — Economics | 2003 – 2007 |

---

> Four degrees across three countries — one consistent thread: how systems perform under constraint.
`
  },
  {
    id: "skills",
    name: "skills.json",
    type: "json",
    icon: "json",
    body: null,
    skills: {
      delivery: [
        { name: "Agile / Scrum / Kanban", level: 95 },
        { name: "Roadmapping", level: 92 },
        { name: "OKRs & metrics", level: 88 },
        { name: "Stakeholder management", level: 94 }
      ],
      technical: [
        { name: "TypeScript / React", level: 78 },
        { name: "SQL & data modeling", level: 82 },
        { name: "System design literacy", level: 75 },
        { name: "Cloud (AWS, GCP)", level: 70 }
      ],
      tools: [
        { name: "Linear", level: 95 },
        { name: "Jira", level: 90 },
        { name: "Notion / Confluence", level: 92 },
        { name: "Figma", level: 78 },
        { name: "Miro", level: 85 }
      ],
      soft: [
        { name: "Coaching", level: 90 },
        { name: "Written communication", level: 93 },
        { name: "Facilitation", level: 91 },
        { name: "Conflict mediation", level: 86 }
      ]
    }
  },
  {
    id: "professional-value",
    name: "professional-value.md",
    type: "md",
    icon: "md",
    body: `# Professional Value

What you actually get when you hire me:

## Week 1 — diagnosis
A written audit of how work moves through your team. Where
it stalls, where it duplicates, where decisions die in
Slack threads.

## Week 2–4 — install
The smallest process change that fixes the biggest leak.
Usually one ritual added, two removed.

## Month 2+ — compound
Your team gets faster without noticing. I get quieter.
That's the goal.

---

## Outcomes from past engagements

| Client     | Before          | After           | Δ           |
|------------|-----------------|-----------------|-------------|
| Fintech A  | 14d lead time   | 3d lead time    | -78%        |
| Devtool B  | 0.6 ship/wk     | 2.4 ship/wk     | +300%       |
| Climate C  | 31% on-time     | 86% on-time     | +55pp       |

Numbers are real, names redacted on request.
`
  },
  {
    id: "certifications",
    name: "certifications.md",
    type: "md",
    icon: "md",
    body: `# Certifications

- **PMP** — Project Management Professional · 2019
- **CSM** — Certified ScrumMaster · 2017
- **PSPO II** — Professional Scrum Product Owner · 2020
- **SAFe Agilist** · 2021 *(used once, do not recommend)*
- **AWS Cloud Practitioner** · 2022

Certifications are table stakes. They prove you sat through
the curriculum, not that you can run a team. Ask me about
the failures instead.
`
  },
  {
    id: "languages",
    name: "languages.md",
    type: "md",
    icon: "md",
    body: `# Languages

## Spoken
- **English** — Native
- **Spanish** — Professional working proficiency
- **Portuguese** — Conversational
- **French** — Reading only, with effort

## Written (the other kind)
- **TypeScript** — daily
- **Python** — for scripts and data
- **SQL** — fluent
- **Bash** — well enough to be dangerous

The first set is for the clients. The second is for the
engineers I work with — speaking their language earns trust
faster than any certification.
`
  },
  {
    id: "availability",
    name: "availability.md",
    type: "md",
    icon: "md",
    body: `# Availability

\`\`\`
status:        OPEN
capacity:      ~25 hrs/week
booking:       Q3 2026
timezone:      GMT+2 (CAT)
remote:        yes, default
on-site:       quarterly, by arrangement
\`\`\`

## Engagement types I take

1. **Fractional PM** — 3–6 months, 15–25 hrs/wk
2. **Delivery audit** — 2 weeks, fixed scope
3. **Coaching** — 1:1s with PMs and EMs, monthly retainer

Not currently taking: full-time roles, equity-only deals,
or anything labeled "rockstar."
`
  },
  {
    id: "contact",
    name: "contact.ts",
    type: "ts",
    icon: "ts",
    body: `// Reach out. I read everything; I reply to most.
// Best signal: a paragraph about your team and what's stuck.

export interface Contact {
  readonly name: string;
  readonly role: string;
  readonly email: string;
  readonly site: string;
  readonly linkedin: string;
  readonly github: string;
  readonly availability: "open" | "limited" | "closed";
  readonly preferred: ContactChannel;
}

type ContactChannel = "email" | "linkedin" | "carrier-pigeon";

export const contact: Contact = {
  name: "Kelvin Benson",
  role: "Agile PM · Consultant · Founder",
  email: "hello@kelvinbenson.com",
  site: "kelvinbenson.com",
  linkedin: "linkedin.com/in/kelvinbenson",
  github: "github.com/kelvinbenson",
  availability: "open",
  preferred: "email",
};

// If you got this far, you're probably the kind of person
// I want to work with. Hit the email above.
export default contact;
`
  }
];
