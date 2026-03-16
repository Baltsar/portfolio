/**
 * Build-time script: fetches projects from Sanity and writes to src/data/projects.json.
 * Falls back to existing JSON if Sanity is unreachable (so the build never breaks).
 *
 * Usage:  node scripts/fetch-sanity.js
 * Env:    SANITY_PROJECT_ID, SANITY_DATASET (default "production"), SANITY_API_VERSION
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(__dirname, '..', 'src', 'data', 'projects.json');

const GROQ = `*[_type == "project"] | order(order asc) {
  id,
  title,
  titleAccent,
  accentClass,
  windowTitle,
  tags[] { label, "class": class },
  art,
  artPlaceholder,
  scanClass,
  spinnerSet,
  winClass,
  overlaySub,
  link,
  caseStudy {
    heroTitle,
    heroSub,
    title,
    sections[] {
      _type,
      text,
      imgRef { id, filename },
      attr,
      resting,
      items
    },
    images[] { id, filename, caption, placeholder },
    meta[] { label, value, color },
    finderPath,
    finderFiles[] { name, size, date, type }
  }
}`;

// Map Sanity _type back to the simple "type" string that render.js / case-study.js expect
const TYPE_MAP = {
  sectionText: 'text',
  sectionIntro: 'intro',
  sectionHtml: 'html',
  sectionQuote: 'quote',
  sectionStats: 'stats',
  sectionList: 'list',
};

function cleanSection(s) {
  const type = TYPE_MAP[s._type] || s._type;
  const out = { type };

  if (s.text != null) out.text = s.text;
  if (s.imgRef) out.imgRef = s.imgRef;
  if (s.attr) out.attr = s.attr;
  if (s.resting) out.resting = s.resting;
  if (s.items) out.items = s.items;

  return out;
}

function cleanProject(p) {
  // Strip Sanity internals (_id, _rev, _type, _createdAt, etc.)
  const { _id, _rev, _type, _createdAt, _updatedAt, order, ...rest } = p;

  if (rest.caseStudy?.sections) {
    rest.caseStudy.sections = rest.caseStudy.sections.map(cleanSection);
  }

  // Remove null/undefined fields
  for (const [k, v] of Object.entries(rest)) {
    if (v == null) delete rest[k];
  }

  return rest;
}

async function main() {
  const projectId = process.env.SANITY_PROJECT_ID;
  if (!projectId) {
    console.log('[sanity] SANITY_PROJECT_ID not set — using existing projects.json');
    return;
  }

  const client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
    useCdn: true,
  });

  try {
    console.log('[sanity] Fetching projects…');
    const projects = await client.fetch(GROQ);

    if (!projects || projects.length === 0) {
      console.log('[sanity] No projects found — keeping existing projects.json');
      return;
    }

    const cleaned = projects.map(cleanProject);
    const output = JSON.stringify({ projects: cleaned }, null, 2);

    writeFileSync(JSON_PATH, output + '\n', 'utf-8');
    console.log(`[sanity] Wrote ${cleaned.length} projects to src/data/projects.json`);
  } catch (err) {
    console.error(`[sanity] Fetch failed: ${err.message}`);
    console.log('[sanity] Falling back to existing projects.json');
  }
}

main();
