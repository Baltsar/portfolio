import { defineType, defineField } from 'sanity';

// --- Reusable object types ---

const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'class',
      title: 'CSS Class',
      type: 'string',
      options: { list: ['shipped', 'active', 'wip', 'concept'] },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'label' } },
});

const imgRef = defineType({
  name: 'imgRef',
  title: 'Image Reference',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'Image ID', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'filename', title: 'Filename', type: 'string', validation: (r) => r.required() }),
  ],
});

// --- Section types (polymorphic via typed objects) ---

const sectionText = defineType({
  name: 'sectionText',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Text (HTML allowed)', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'imgRef', title: 'Image Reference', type: 'imgRef' }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: ({ title }) => ({ title: title?.substring(0, 80) + '…', subtitle: 'Text' }),
  },
});

const sectionIntro = defineType({
  name: 'sectionIntro',
  title: 'Intro',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Intro text (HTML allowed)', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: ({ title }) => ({ title: title?.substring(0, 80) + '…', subtitle: 'Intro' }),
  },
});

const sectionHtml = defineType({
  name: 'sectionHtml',
  title: 'Raw HTML',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'HTML', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: ({ title }) => ({ title: title?.substring(0, 60) + '…', subtitle: 'HTML' }),
  },
});

const sectionQuote = defineType({
  name: 'sectionQuote',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Quote text', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'attr', title: 'Attribution (HTML allowed)', type: 'string' }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: ({ title }) => ({ title: `"${title?.substring(0, 60)}…"`, subtitle: 'Quote' }),
  },
});

const statItem = defineType({
  name: 'statItem',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'color', title: 'Color override', type: 'string', description: 'CSS class, e.g. "blue"' }),
  ],
  preview: {
    select: { value: 'value', label: 'label' },
    prepare: ({ value, label }) => ({ title: `${value} — ${label}` }),
  },
});

const sectionStats = defineType({
  name: 'sectionStats',
  title: 'Stats',
  type: 'object',
  fields: [
    defineField({ name: 'items', title: 'Stats', type: 'array', of: [{ type: 'statItem' }], validation: (r) => r.required().min(1) }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({ title: `${items?.length || 0} stats`, subtitle: 'Stats' }),
  },
});

const sectionList = defineType({
  name: 'sectionList',
  title: 'List',
  type: 'object',
  fields: [
    defineField({ name: 'resting', title: 'Resting glyph', type: 'string', initialValue: '>' }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }], validation: (r) => r.required().min(1) }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({ title: `${items?.length || 0} items`, subtitle: 'List' }),
  },
});

// --- Case study image ---

const caseImage = defineType({
  name: 'caseImage',
  title: 'Case Study Image',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID (numeric)', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'filename', title: 'Filename', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'placeholder', title: 'Placeholder (HTML allowed)', type: 'text', rows: 2, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'filename', subtitle: 'caption' },
  },
});

// --- Case study meta ---

const caseMeta = defineType({
  name: 'caseMeta',
  title: 'Meta Item',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'color', title: 'Color override (CSS)', type: 'string' }),
  ],
  preview: {
    select: { label: 'label', value: 'value' },
    prepare: ({ label, value }) => ({ title: `${label}: ${value}` }),
  },
});

// --- Finder file ---

const finderFile = defineType({
  name: 'finderFile',
  title: 'Finder File',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Filename', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'size', title: 'Size', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'type', title: 'Type', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'size' },
  },
});

// --- Main project document ---

const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    // --- Window fields ---
    defineField({ name: 'id', title: 'ID (slug)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required(), description: 'e.g. "MONERO"' }),
    defineField({ name: 'titleAccent', title: 'Title Accent', type: 'string', validation: (r) => r.required(), description: 'e.g. "MCP"' }),
    defineField({
      name: 'accentClass',
      title: 'Accent Color Class',
      type: 'string',
      options: { list: ['w-green', 'w-blue', 'w-beige'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'windowTitle', title: 'Window Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'tag' }] }),
    defineField({ name: 'art', title: 'Art Path', type: 'string', description: 'e.g. "/art/monero-mcp.png"' }),
    defineField({ name: 'artPlaceholder', title: 'Art Placeholder Class', type: 'string' }),
    defineField({ name: 'scanClass', title: 'Scan CSS Class', type: 'string', description: 'e.g. "blue-scan" or empty' }),
    defineField({
      name: 'spinnerSet',
      title: 'Spinner Set',
      type: 'string',
      options: { list: ['braille', 'arrows', 'blocks', 'classic'] },
      initialValue: 'braille',
    }),
    defineField({ name: 'winClass', title: 'Window CSS Class', type: 'string', description: 'e.g. "win-1"' }),
    defineField({ name: 'overlaySub', title: 'Overlay Subtitle', type: 'string' }),
    defineField({ name: 'link', title: 'External Link', type: 'url' }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 0 }),

    // --- Case Study ---
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'object',
      fields: [
        defineField({ name: 'heroTitle', title: 'Hero Title (HTML)', type: 'text', rows: 2 }),
        defineField({ name: 'heroSub', title: 'Hero Subtitle', type: 'string' }),
        defineField({ name: 'title', title: 'Case Study Title', type: 'string' }),
        defineField({
          name: 'sections',
          title: 'Sections',
          type: 'array',
          of: [
            { type: 'sectionText' },
            { type: 'sectionIntro' },
            { type: 'sectionHtml' },
            { type: 'sectionQuote' },
            { type: 'sectionStats' },
            { type: 'sectionList' },
          ],
        }),
        defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'caseImage' }] }),
        defineField({ name: 'meta', title: 'Meta', type: 'array', of: [{ type: 'caseMeta' }] }),
        defineField({ name: 'finderPath', title: 'Finder Path (HTML)', type: 'string' }),
        defineField({ name: 'finderFiles', title: 'Finder Files', type: 'array', of: [{ type: 'finderFile' }] }),
      ],
    }),
  ],
  orderings: [
    { title: 'Sort Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', accent: 'titleAccent', status: 'tags' },
    prepare: ({ title, accent }) => ({ title: `${title} ${accent}` }),
  },
});

// Export all types
export const schemaTypes = [
  tag,
  imgRef,
  sectionText,
  sectionIntro,
  sectionHtml,
  sectionQuote,
  statItem,
  sectionStats,
  sectionList,
  caseImage,
  caseMeta,
  finderFile,
  project,
];
