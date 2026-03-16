/**
 * Migration script: converts src/data/projects.json → Sanity ndjson,
 * then imports it via the Sanity CLI.
 *
 * Usage: node scripts/migrate-to-sanity.js
 * Then:  cd studio && npx sanity dataset import ../migration.ndjson production
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(__dirname, '..', 'src', 'data', 'projects.json');
const OUT_PATH = resolve(__dirname, '..', 'migration.ndjson');

const data = JSON.parse(readFileSync(JSON_PATH, 'utf-8'));

// Map section type strings to Sanity _type names
const SECTION_TYPE_MAP = {
  text: 'sectionText',
  intro: 'sectionIntro',
  html: 'sectionHtml',
  quote: 'sectionQuote',
  stats: 'sectionStats',
  list: 'sectionList',
};

function randomKey() {
  return Math.random().toString(36).slice(2, 14);
}

function convertSection(s) {
  const sanityType = SECTION_TYPE_MAP[s.type] || 'sectionText';
  const out = { _type: sanityType, _key: randomKey() };

  if (s.text != null) out.text = s.text;
  if (s.attr) out.attr = s.attr;
  if (s.resting) out.resting = s.resting;

  if (s.imgRef) {
    out.imgRef = { _type: 'imgRef', id: s.imgRef.id, filename: s.imgRef.filename };
  }

  if (s.items) {
    if (s.type === 'stats') {
      out.items = s.items.map((item) => ({
        _type: 'statItem',
        _key: randomKey(),
        value: item.value,
        label: item.label,
        ...(item.color ? { color: item.color } : {}),
      }));
    } else if (s.type === 'list') {
      // Sanity array of strings needs _key
      out.items = s.items.map((item) => typeof item === 'string' ? item : item);
    }
  }

  return out;
}

function convertProject(p, index) {
  const doc = {
    _id: `project-${p.id}`,
    _type: 'project',
    id: p.id,
    title: p.title,
    titleAccent: p.titleAccent,
    accentClass: p.accentClass,
    windowTitle: p.windowTitle,
    tags: (p.tags || []).map((t) => ({
      _type: 'tag',
      _key: randomKey(),
      label: t.label,
      class: t.class,
    })),
    art: p.art || '',
    artPlaceholder: p.artPlaceholder || '',
    scanClass: p.scanClass || '',
    spinnerSet: p.spinnerSet || 'braille',
    winClass: p.winClass || '',
    overlaySub: p.overlaySub || '',
    link: p.link || '',
    order: index,
  };

  if (p.caseStudy) {
    const cs = p.caseStudy;
    doc.caseStudy = {
      heroTitle: cs.heroTitle || '',
      heroSub: cs.heroSub || '',
      title: cs.title || '',
      sections: (cs.sections || []).map(convertSection),
      images: (cs.images || []).map((img) => ({
        _type: 'caseImage',
        _key: randomKey(),
        id: img.id,
        filename: img.filename,
        caption: img.caption,
        placeholder: img.placeholder,
      })),
      meta: (cs.meta || []).map((m) => ({
        _type: 'caseMeta',
        _key: randomKey(),
        label: m.label,
        value: m.value,
        ...(m.color ? { color: m.color } : {}),
      })),
      finderPath: cs.finderPath || '',
      finderFiles: (cs.finderFiles || []).map((f) => ({
        _type: 'finderFile',
        _key: randomKey(),
        name: f.name,
        size: f.size,
        date: f.date,
        type: f.type,
      })),
    };
  }

  return doc;
}

const ndjson = data.projects.map((p, i) => JSON.stringify(convertProject(p, i))).join('\n');
writeFileSync(OUT_PATH, ndjson + '\n', 'utf-8');

console.log(`[migrate] Wrote ${data.projects.length} projects to migration.ndjson`);
console.log('');
console.log('Next steps:');
console.log('  cd studio');
console.log('  npx sanity dataset import ../migration.ndjson production');
