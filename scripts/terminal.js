const commands = {
  'help': 'available commands: help, whoami, hire, stack, projects, clear, sudo, exit',
  'whoami': 'visitor. curious one. i like that.',
  'hire': 'gustaf.garnow@gmail.com — or just say hi on linkedin. i don\'t bite.',
  'stack': 'claude · cursor · figma · adobe suite · github · mcp · too much coffee',
  'projects': 'monero-mcp (shipped) · opensverige (active) · zhc (building) — scroll up to see them',
  'sudo': 'nice try.',
  'sudo hire gustaf': 'permission granted. sending contract... just kidding. email me.',
  'exit': 'you can\'t exit. this is a portfolio. you live here now.',
  'ls': 'monero-mcp/  opensverige/  zhc/  enterprise/  README.md  .secret',
  'cat readme.md': '10 years of design. then AI happened. — gustaf garnow, 2026',
  'cat .secret': 'he vibecoded this entire portfolio in one day. don\'t tell anyone.',
  'cd': 'there\'s nowhere else to go. this is it. this is the portfolio.',
  'ping': 'pong. latency: 0ms. because this runs locally in your browser.',
  'coffee': '☕ brewing... done. now go hire gustaf.',
  'kaffe': '☕ brewing... done. now go hire gustaf.',
};

const greetings = ['hello', 'hi', 'hej', 'hey', 'hejsan', 'tja'];
const MAX_LINES = 10;

let isKillMode = false;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addCmd(output, raw) {
  const el = document.createElement('div');
  el.className = 'term-cmd';
  el.innerHTML = `<span class="u">gustaf</span><span class="a">@</span><span class="p">garnow</span><span class="s">:~$ </span>${escapeHtml(raw)}`;
  output.appendChild(el);
}

function addResp(output, text) {
  const el = document.createElement('div');
  el.className = 'term-resp';
  el.textContent = text;
  output.appendChild(el);
}

function trimOutput(output) {
  while (output.children.length > MAX_LINES * 2) {
    output.removeChild(output.firstChild);
  }
  output.scrollTop = output.scrollHeight;
}

function typeSequence(output, lines, delay, callback) {
  let i = 0;
  function next() {
    if (i < lines.length) {
      addResp(output, lines[i]);
      trimOutput(output);
      i++;
      setTimeout(next, delay);
    } else if (callback) {
      callback();
    }
  }
  next();
}

export function initTerminal() {
  const terminal = document.getElementById('interactive-terminal');
  const output = document.getElementById('term-output');
  const input = document.getElementById('term-input');
  const hint = document.getElementById('term-hint');
  if (!terminal || !output || !input) return;

  let firstCommand = true;

  terminal.addEventListener('click', () => input.focus());

  // Auto-size input to content
  function resizeInput() {
    const len = input.value.length;
    input.style.width = (len === 0 ? 1 : len) + 'ch';
  }
  input.addEventListener('input', resizeInput);
  resizeInput();

  input.addEventListener('focus', () => {
    terminal.classList.add('focused');
  });
  input.addEventListener('blur', () => {
    terminal.classList.remove('focused');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    input.value = '';
    resizeInput();
    if (!raw) return;

    // Hide hint after first command
    if (firstCommand && hint) {
      hint.classList.add('hidden');
      firstCommand = false;
    }

    const cmd = raw.toLowerCase();
    addCmd(output, raw);

    // Kill mode — waiting for y/n
    if (isKillMode) {
      isKillMode = false;
      if (cmd === 'y') {
        typeSequence(output, [
          '...',
          'ok but first — tell me why.',
          '→ gustaf.garnow@gmail.com',
          '(portfolio respawns in 3... 2... 1...)',
        ], 300, () => {
          setTimeout(() => { output.innerHTML = ''; }, 2000);
        });
      } else if (cmd === 'n') {
        addResp(output, 'phew. thanks for not killing my portfolio.');
        addResp(output, 'it worked really hard to get here.');
      } else {
        addResp(output, 'that\'s not y or n. the portfolio lives another day.');
      }
      trimOutput(output);
      return;
    }

    // Kill / rm -rf trigger
    if (cmd === 'kill' || cmd === 'rm -rf' || cmd.startsWith('rm -rf ')) {
      isKillMode = true;
      typeSequence(output, [
        '⚠ WARNING: you are about to delete this portfolio.',
        'all projects. all vibes. all coffee references.',
        'are you sure? (y/n)',
      ], 300);
      return;
    }

    // Clear
    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    // Find response
    let response;
    if (commands[cmd]) {
      response = commands[cmd];
    } else if (greetings.includes(cmd)) {
      response = 'hej! scroll around. click things. break nothing.';
    } else {
      response = `command not found: ${escapeHtml(raw)}. try 'help' for available commands.`;
    }

    addResp(output, response);
    trimOutput(output);
  });
}
