# Deploy

Sajten kör på **Vercel**. Push till `main` → automatisk deploy.

## Social meta (Facebook, LinkedIn, Twitter)

- **og:url** och **canonical** är satta per sida (/sv, /en, /sv/experiment, /en/experiment).
- **og:title, og:description, og:image** + **twitter:card** (summary_large_image) finns.
- **fb:app_id** (valfritt): Skapa en [Facebook App](https://developers.facebook.com/apps/), ta App ID, sätt i Vercel som miljövariabel **NEXT_PUBLIC_FB_APP_ID**. Då läggs `<meta property="fb:app_id">` in automatiskt.

## OG-bild

Ladda upp **`public/og.png`** (1200×630 px). Alternativ A: "GUSTAF BALTSAR GARNOW / Working in public". Alternativ B: "ARBETAR ÖPPET / Digital designer". Metadata pekar på `/og.png`.
