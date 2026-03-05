# CLAUDE CODE BRIEF — Gustaf Garnow Portfolio

**KRITISKT: Läs HELA detta dokument innan du skriver en enda rad kod.**

---

## Vad detta är

En portfolio-sajt som ser ut som ett macOS-skrivbord. Fönster med projekt ligger utspridda. Man kan dra dem, klicka för att öppna case studies, och filtrera mellan kaos och grid-layout. 

Hela den visuella designen är KLAR. Den ligger i `visual-spec.html`. Ändra INGET visuellt utan att fråga först. Din uppgift är att göra den interaktiv och deploybar.

---

## Tech Stack

- **Framework:** Astro, Next.js, eller ren Vite + vanilla JS — välj det enklaste som löser uppgiften. Inget React om det inte behövs.
- **Styling:** Alla CSS custom properties och styles finns i `visual-spec.html`. Extrahera dem till separata filer men ändra INGA värden.
- **Deploy:** Vercel eller Netlify. Statisk site. Inget CMS behövs just nu.
- **Bilder:** Placeras i `/public/art/` — varje projekt får sin illustration som `.png` eller `.webp`.

---

## Filer att extrahera från visual-spec.html

1. **CSS Custom Properties (tokens)** → `styles/tokens.css`
2. **Komponent-CSS** → `styles/components/` (window.css, overlay.css, flow-arrows.css, footer.css, case-study.css, etc.)
3. **HTML-struktur** → sidmallar/komponenter
4. **JavaScript** → `scripts/` (grain.js, layout-toggle.js, preview-swap.js, export-easter-egg.js, window-click.js)

---

## Design System — RÖRINTE

### Färger
```
--bg: #0a0a0a
--win-bg: #f5e6c8
--win-titlebar: #e8d5b0
--win-border: #c4a97a
--win-border-dark: #8a7352
--green: #33ff33
--green-dim: #1a8c1a
--blue: #0033ff
--blue-bright: #3366ff
--text-primary: #f5e6c8
--text-secondary: #9c8b6e
--text-dim: #5c5040
```

### Typsnitt
```
--font-mono: 'IBM Plex Mono', monospace  (all body text, UI, terminal)
--font-display: 'Space Mono', monospace  (headlines, overlay titles)
```

Google Fonts: `IBM+Plex+Mono:wght@300;400;500;600;700` + `Space+Mono:wght@400;700`

### Inga andra typsnitt. Inga sans-serif. Allt mono.

---

## Komponenter

### 1. Mac Window
Classic macOS fönster-chrome. Beige titlebar, tre knappar (close/min/max), titel centrerad, drag handle nere till höger (diagonal hatching-linjer).

**States:**
- Default: static position, box-shadow
- Hover: lift (-3px, -3px), starkare shadow, scale(1.01)
- Dragging: cursor grabbing, higher z-index
- Clicked: z-index 60 (framför alla andra)

**OBS:** `overflow: visible` på `.mac-content` och `.project-canvas` — texten MÅSTE spilla ut ur fönstret.

### 2. Project Art + Overlay Title
Varje fönster har en illustration (bakgrundsbild) med en MASSIV titel ovanpå.
- Titel: `clamp(7rem, 28vw, 16rem)`, `white-space: nowrap`, centrerad
- Texten bryter ut ur fönsterramen (overflow visible)
- Tunn mörk overlay (rgba 0,0,0,0.2) för läsbarhet
- Scan-line animation vid hover (grön eller blå gradient, 2.5s linear infinite)
- Aspect ratio på art: `5/3`

### 3. Project Bar
Botten av varje fönster. Tags (passiva labels, EJ knappar) till vänster, expand-knapp till höger.
- Tags: ingen border, ingen bakgrund, 0.4375rem, låg opacity
- Expand-knapp: `⌐ Open`, border, bakgrund, hover-inverterar, ENDA klickbara elementet

### 4. Flow Arrows
SVG paths med `stroke-dasharray: 8 6` och animation. Visar kopplingar mellan aktiva projekt. `marker-end` med pilspets. z-index 30 (ovanför fönster).
- Grön = aktivt arbete
- Blå = koppling/community
- Försvinner i grid-mode

### 5. Layout Toggle
Två knappar: kaos-ikon (sneda rektanglar) och grid-ikon (2x2). 
- Sitter UTANFÖR windows-area (undvik z-index-konflikter)
- Tooltip vid hover: "kreativt kaos (default)" / "okej, jag städar..."
- Grid-mode: CSS grid, alla fönster relative, equal size, pilar gömda

### 6. Profile Window
Eget fönster bland projekten. Plats för foto, namn, roll, tech stack grid.
- Tech stack: `highlight`-klass på AI-tools (Claude, Cursor, GitHub, MCP)
- Ingen expand-knapp — detta är inte ett projekt

### 7. Status Bar
Fixerad topp. "AVAILABLE FOR WORK" med pulserande grön dot.

### 8. Terminal Footer
`gustaf@garnow:~$ ` med blinkande cursor. Länkar som terminal-kommandon.
Export easter egg längst ner med tre knappar (.md, .txt, .pdf).
- PDF-knappen har tooltip "(requires meetings)" och ger rolig error-text

### 9. Grain Background
Canvas-baserad noise animation, ~12fps, `opacity: 0.06`, `mix-blend-mode: screen`. Subtle scanlines via `body::after`.

---

## Interaktivitet att bygga

### A. Drag & Drop (PRIORITET 1)
Varje mac-window ska vara draggbar.
- Drag via titlebar ELLER drag-handle
- Spara position i minne (ej persistent mellan sessioner, det är OK)
- Z-index: fönstret som dras hamnar överst
- Grid-mode: drag disabled
- Touch-support för mobil (men mobil är stacked layout, så drag är desktop-only)

### B. Case Study Popup (PRIORITET 2)
Klick på expand-knappen (`⌐ Open`) öppnar en case study.

**Strukturen:**
1. Backdrop dimmar resten (rgba 0,0,0,0.6 + blur 3px)
2. Case study fönster animerar in (scale 0.95 → 1, opacity 0 → 1)
3. Innehåll: Hero (50vh med art + exploding title) → Split view (text 40% / preview 60%) → Finder assets → Meta bar
4. Stäng via close-knappen i titlebar

**Split View — inline image refs:**
- I texten finns `<span class="img-ref">filnamn.png</span>`
- Desktop: `mouseenter` på ref → höger preview-panel byter bild+caption. Instant swap, ingen animation.
- Mobil: `click` istället för hover
- Active ref har solid blå bakgrund
- Data per bild: placeholder-text (byts mot riktig bild senare), filnamn, caption-text, index

### C. Layout Toggle (PRIORITET 3)
Redan fungerande i specen. Behåll logiken:
- Chaos: absolute positioning, rotation, overlapping
- Grid: CSS grid, relative positioning, no transforms
- Case study section margin anpassas (500px i chaos, 60px i grid)

### D. Export Easter Egg (PRIORITET 4)
Tre knappar i footer. Klick byter output-text ovanför:
- .md → grön text, "4 projects shipped. 0 meetings attended."
- .txt → neutral text
- .pdf → röd text, "error: pdf export requires 3 stakeholder meetings..."

---

## Projekt-data

Varje projekt har:
```
{
  id: string,
  title: string,           // "MONERO" 
  titleAccent: string,     // "MCP" (accent-färg)
  accentColor: "green" | "blue" | "beige",
  windowTitle: string,     // "monero-mcp — world first"
  tags: string[],          // ["shipped", "active"]
  art: string,             // "/art/monero-mcp.png"
  link: string,            // GitHub/extern URL
  isActive: boolean,       // Visar pilar
  position: { top, left/right, width, zIndex, rotation },
  caseStudy: {
    heroTitle: string,
    heroSub: string,
    text: string,          // Markdown eller HTML med .img-ref spans
    images: [{
      id: number,
      filename: string,
      caption: string,
      placeholder: string  // Ersätts med riktig bild
    }],
    meta: [{ label, value }],
    finderFiles: [{ name, size, date, type }]
  }
}
```

### Aktuella projekt:
1. **Monero MCP** — shipped, active, green accent
2. **OpenSverige** — active, blue accent  
3. **Hermes Agent** — concept, blue accent
4. **Enterprise Design** (AMF anonymiserat) — shipped, beige accent

### Profil:
- Namn: Gustaf Garnow
- Roll: Digital Producer / Creative Technologist / AI-Native
- Stack highlights: Claude, Cursor.ai, GitHub, MCP
- Stack standard: Figma, Photoshop, Illustrator, After Effects, Premiere, InDesign

---

## Mobil-approach

- Fönster stackas vertikalt, full width, `position: relative`
- Ingen drag
- Inga pilar
- Overlay-titel: `clamp(4.5rem, 25vw, 8rem)`
- Case study split-view stackas (text ovanför, preview under)
- Img-refs kräver click istället för hover
- Layout toggle: dölj eller disable (allt är redan stacked)
- Drag handles: `display: none`

---

## Filstruktur (förslag)

```
gustaf-portfolio/
├── public/
│   └── art/
│       ├── monero-mcp.png
│       ├── opensverige.png
│       ├── hermes-agent.png
│       └── enterprise.png
├── src/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components/
│   │   │   ├── window.css
│   │   │   ├── overlay.css
│   │   │   ├── project-bar.css
│   │   │   ├── flow-arrows.css
│   │   │   ├── case-study.css
│   │   │   ├── profile.css
│   │   │   ├── layout-toggle.css
│   │   │   ├── footer.css
│   │   │   └── status-bar.css
│   │   └── grain.css
│   ├── scripts/
│   │   ├── grain.js
│   │   ├── drag.js
│   │   ├── case-study.js
│   │   ├── layout-toggle.js
│   │   ├── preview-swap.js
│   │   └── export.js
│   ├── data/
│   │   └── projects.json
│   └── index.html (eller framework equivalent)
├── visual-spec.html        ← REFERENS, rör ej
├── CLAUDE-CODE-BRIEF.md    ← DETTA DOKUMENT
└── package.json
```

---

## Regler

1. **Ändra INGA designvärden** (färger, typsnitt, storlekar, spacing) utan att fråga Gustaf.
2. **Referera alltid till visual-spec.html** — det är sanningen. Om koden inte matchar specen har du fel.
3. **Bygg en komponent i taget.** Testa att den matchar specen visuellt innan du går vidare.
4. **Overflow visible** är medvetet. Titlarna SKA bryta ut ur fönstren. Fixa inte det.
5. **Grain-animationen** ska köra på ~12fps (performance). Använd requestAnimationFrame med throttle.
6. **Inga bibliotek för drag** om vanilla JS räcker. Håll det enkelt.
7. **Deploy early.** Gustaf behöver en live URL inom 1-2 dagar. Ship > perfekt.

---

## Kontakt
- gustaf.garnow@gmail.com
- github.com/Baltsar
- linkedin.com/in/gustafgarnow

---

*Starta med: "Jag har läst briefen. Här är min plan..." och lista stegen innan du kodar.*
