# Deploy & SEO

## OG-bild (social delning)

Social preview använder **`public/images/DigitalDesigner_GustafGarnow.png`** (1200×630 px). Används av Twitter/LinkedIn/Facebook när någon delar sidan.

---

# Deploy till Hostinger (statisk export)

Sajten byggs som **statiska filer** (HTML/CSS/JS). Hostinger förväntar sig filer i `public_html`, inte Next.js-källkod.

## Varför 403 / ingen index.html?

- **GitHub-webhook** kopierar oftast bara **repot** till servern → du får `package.json`, `app/`, `components/` osv., men **ingen** `index.html` i root.
- Webbhotellet söker efter `index.html` (eller liknande) i `public_html`. Finns den inte → 403 Forbidden.

**Lösning:** Deploya **byggresultatet** (mappen `out`), inte källkoden.

---

## Steg 1: Bygg lokalt

```bash
npm install
npm run build
```

Efter bygget ligger allt som ska ut på webben i mappen **`out/`**:
- `out/index.html` (redirect till `/sv`)
- `out/sv/` och `out/en/` (sidor)
- `out/_next/` (JS/CSS)
- `out/images/` (bilder)

---

## Steg 2: Lägg innehållet i `public_html`

Du ska **inte** ladda upp hela mappen `out` som en mapp. Du ska lägga **innehållet** i `out` direkt i `public_html`.

**Rätt filstruktur på Hostinger:**

```
public_html/
  index.html      ← från out/index.html
  sv/
    index.html    (och ev. experiment.html)
  en/
    index.html    (och ev. experiment.html)
  _next/
    static/       (chunks, css, media)
  images/
    80x80_*.png   osv.
```

**Så gör du:**

1. Öppna **File Manager** på Hostinger.
2. Gå in i **`public_html`**.
3. Ta bort ev. gamla filer som inte ska vara kvar (om du vill ha en ren deploy).
4. Ladda upp **alla filer och mappar som finns inuti `out`** så att de hamnar direkt i `public_html`:
   - Dra in `index.html` (från `out/`) till `public_html/`
   - Dra in mapparna `sv/`, `en/`, `_next/`, `images/` (från `out/`) till `public_html/`

Alltså: **Innehållet i `out` = innehållet i `public_html`.**

---

## Om webhook bara synkar från GitHub

Om Hostinger bara **synkar repot** (utan att köra `npm run build`) får du fortfarande ingen `index.html` i root, eftersom `out` inte finns i Git (den genereras vid build).

Då har du två vägar:

1. **Manuell deploy (enklast idag):**  
   Bygg lokalt (`npm run build`) och ladda upp innehållet i `out` till `public_html` (FTP eller File Manager), som ovan.

2. **Automatisk deploy:**  
   Sätt t.ex. upp en **GitHub Action** som vid push:
   - kör `npm ci && npm run build`
   - laddar upp innehållet i `out` till Hostinger (t.ex. via FTP eller deras API om de har det).

---

## Kort checklista

- [ ] `npm run build` körs (lokalt eller i CI).
- [ ] Innehållet i **`out`** (inte själva mappen `out`) ligger i **`public_html`**.
- [ ] `public_html/index.html` finns (redirect till `/sv`).
- [ ] `public_html/sv/`, `public_html/en/`, `public_html/_next/`, `public_html/images/` finns.

Då ska 403 försvinna och sajten visas.
