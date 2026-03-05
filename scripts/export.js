const MD_CONTENT = `# Gustaf Baltsar Garnow — Portfolio

> Designer som kodar. Builder som shippar.
> 10+ år design. AI-native. Open source.

## Projects

### Monero MCP
World's first Monero MCP Server. Vibecoded i Cursor med Claude.
Open source. github.com/Baltsar/monero-mcp

### OpenSverige
AI Agent Community. Meetups. Building in public.
opensverige.se

### Hermes Agent
Nous Research. Agent Framework. Exploration.

### Enterprise Design
7+ år. Pension & Finans. Ads, email, animation, print.

---
gustaf.garnow@gmail.com | github.com/Baltsar | linkedin.com/in/gustafgarnow
`;

const TXT_CONTENT = `Gustaf Baltsar Garnow — Portfolio

Designer som kodar. Builder som shippar.
10+ år design. AI-native. Open source.

Projects
--------

Monero MCP
World's first Monero MCP Server. Vibecoded i Cursor med Claude.
Open source. github.com/Baltsar/monero-mcp

OpenSverige
AI Agent Community. Meetups. Building in public.
opensverige.se

Hermes Agent
Nous Research. Agent Framework. Exploration.

Enterprise Design
7+ år. Pension & Finans. Ads, email, animation, print.

--------
gustaf.garnow@gmail.com | github.com/Baltsar | linkedin.com/in/gustafgarnow
`;

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function initExport() {
  const responses = {
    md: [
      '> generating gustaf_garnow.md ...',
      '> 4 projects shipped. 0 meetings attended.',
      '> exported. open in your favorite AI agent.'
    ],
    txt: [
      '> gustaf_garnow.txt \u2014 plain text, plain human.',
      '> warning: contains opinions.',
      '> exported. curl-friendly.'
    ],
    pdf: [
      '> error: pdf export requires 3 stakeholder meetings,',
      '> 2 rounds of feedback, and a Jira ticket.',
      "> try .md instead. it's faster. like gustaf."
    ]
  };

  document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.dataset.format;
      const output = document.querySelector('.export-output');
      const lines = responses[format] || responses.md;

      output.innerHTML = lines.map(l =>
        `<span style="color: ${
          format === 'pdf' ? '#ff5f57' : format === 'md' ? 'var(--green)' : 'var(--text-secondary)'
        }">${l}</span>`
      ).join('<br>');

      // Actually download for md and txt
      if (format === 'md') {
        downloadFile(MD_CONTENT, 'gustaf_garnow.md', 'text/markdown');
      } else if (format === 'txt') {
        downloadFile(TXT_CONTENT, 'gustaf_garnow.txt', 'text/plain');
      }
      // pdf: joke only, no download
    });
  });
}
