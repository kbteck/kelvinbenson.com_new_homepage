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
    type: "overview",
    icon: "md",
    heading: "Overview",
    code: `const kelvin: Consultant = {
  role:      "Software Project Manager",
  company:   "Vawick Software",
  focus:     ["delivery", "coaching", "tooling"],
  mindset:   "engineering-first",
  available:  true,
};`,
    body: `---

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
    type: "education",
    icon: "md",
    heading: "Education",
    code: `const degrees   = 4;
const countries = ["Germany", "Spain", "UK (Remote)", "Nigeria"];
const span      = "2003 – 2021";`,
    body: `---

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
    type: "professional-value",
    icon: "md",
    heading: "Professional Value",
    code: `interface ProfessionalValue {
  mindset:   "servant-leadership";
  expertise: string[];
  approach:  string[];
}

const kelvin: ProfessionalValue = {
  mindset:   "servant-leadership",
  expertise: ["Agile frameworks", "SaaS delivery", "DevOps"],
  approach:  ["coaching", "collaboration", "technical insight"],
};`,
    body: `---

A servant-leadership approach that empowers teams and aligns stakeholders
around shared goals. Strategy and execution in the same conversation —
not in separate rooms.

---

## What I bring

| Capability | What it means for you |
|---|---|
| **Servant leadership** | Teams that own their work and deliver consistently |
| **Agile + SaaS expertise** | Roadmap to release without losing the thread |
| **Coaching mindset** | Capability that stays after the engagement ends |
| **Technical insight** | No translation layer between you and your engineers |
| **Stakeholder alignment** | Shared goals, fewer surprises, faster decisions |

---

> Creating environments where innovation and continuous improvement are the default — not the exception.

---

## Currently building

*Case studies and project outcomes in progress. Check back soon.*
`
  },
  {
    id: "certifications",
    name: "certifications.md",
    type: "certifications",
    icon: "md",
    note: `> Certifications are table stakes. They prove you sat through the curriculum, not that you can run a team. Ask me about the failures instead.`,
    certs: [
      {
        id: "safe-6-sm",
        name: "SAFe® 6.0 Scrum Master",
        abbr: "SSM",
        issuer: "Scaled Agile",
        imageUrl: "https://images.credly.com/size/340x340/images/441384f8-8b0a-4e7f-94bd-966496a10fd9/image.png",
        verifyUrl: "https://www.credly.com/badges/0dee3faf-2f15-4d82-a849-95f534f48342"
      },
      {
        id: "icp-acc",
        name: "ICP-ACC",
        abbr: "ICP-ACC",
        issuer: "ICAgile",
        imageUrl: "https://www.icagile.com/media/badges/png/ICP-ACC.png",
        verifyUrl: "https://www.icagile.com/credentials/3bebe085-e3c5-4aef-aa59-ac89660671f8"
      },
      {
        id: "psm-1",
        name: "PSM I",
        abbr: "PSM I",
        issuer: "Scrum.org",
        imageUrl: "https://images.credly.com/size/340x340/images/a2790314-008a-4c3d-9553-f5e84eb359ba/image.png",
        verifyUrl: "https://www.credly.com/badges/70890a79-adcd-42d2-b7c7-f97c52f37152"
      },
      {
        id: "pspo-1",
        name: "PSPO I",
        abbr: "PSPO I",
        issuer: "Scrum.org",
        imageUrl: "https://images.credly.com/size/340x340/images/591762c5-fae7-49c6-b326-e1756979928d/image.png",
        verifyUrl: "https://www.credly.com/badges/5d31400a-571c-480b-812a-9041d833f96c"
      },
      {
        id: "cspo",
        name: "CSPO",
        abbr: "CSPO",
        issuer: "Scrum Alliance",
        imageUrl: "https://www.scrumalliance.org/badges/sa-cspo-600.png",
        verifyUrl: "https://www.scrumalliance.org"
      },
      {
        id: "asm-exin",
        name: "ASM-EXIN",
        abbr: "ASM",
        issuer: "EXIN",
        imageUrl: "https://mylogin.exin.nl/BlobData/Exillence/MultiModuleCertificate/CertificateBadgeImage/630589.png?ts=43641.5914699074",
        verifyUrl: "https://mylogin.exin.nl/?CERTIFICATENUMBER=6409477.20836974&LASTNAME=Benson&MODULEID=630589&PAGEID=0&SID=9e5fc41324709c6183da98cb7fc447d0&TOOLNAME=CertificateCheckTool"
      },
      {
        id: "capm-iapm",
        name: "CAPM-IAPM",
        abbr: "CAPM",
        issuer: "IAPM",
        imageUrl: "https://www.iapm.net/uploaded_files/_managedByElements/iapm-badge-round-big-agilepm_id36258.jpeg?@1260x1260/rpo",
        verifyUrl: "https://www.iapm.net/en/certification/levels-of-certification/certified-agile-project-manager-iapm/"
      }
    ]
  },
  {
    id: "languages",
    name: "languages.md",
    type: "languages",
    icon: "md",
    spoken: [
      { name: "English",  level: "native",         pct: 100 },
      { name: "German",   level: "professional",   pct: 84  },
      { name: "Spanish",  level: "conversational", pct: 68  },
    ],
    written: [
      { name: "TypeScript",  usage: "daily",           pct: 95 },
      { name: "React",       usage: "daily",           pct: 90 },
      { name: "Python",      usage: "scripts & data",  pct: 82 },
      { name: "SQL",         usage: "fluent",          pct: 88 },
      { name: "Bash",        usage: "well enough",     pct: 72 },
    ],
  },
  {
    id: "availability",
    name: "availability.md",
    type: "availability",
    icon: "md",
    heading: "Availability",
    code: `status:        OPEN
capacity:      ~25 hrs/week
booking:       Q3 2026
timezone:      GMT+2 (CAT)
remote:        yes, default
on-site:       quarterly, by arrangement`,
    body: `---

## Engagement types I take

1. **Technical Agile Delivery** — 4–12 weeks, execution-focused
2. **Delivery Audit** — 1–2 weeks, fixed scope
3. **Agile Setup** — short-term, team + process implementation
4. **Embedded Support** — flexible, critical delivery phases

Currently taking: full-time roles, equity-only deals, or anything labeled "rockstar."
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
