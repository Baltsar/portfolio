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

export function initTerminal() {
  const terminal = document.getElementById('interactive-terminal');
  const output = document.getElementById('term-output');
  const input = document.getElementById('term-input');
  if (!terminal || !output || !input) return;

  // Click anywhere in terminal to focus input
  terminal.addEventListener('click', () => input.focus());

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;

    const cmd = raw.toLowerCase();

    // Add command line to output
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-cmd';
    cmdLine.innerHTML = `<span class="u">gustaf</span><span class="a">@</span><span class="p">garnow</span><span class="s">:~$ </span>${escapeHtml(raw)}`;
    output.appendChild(cmdLine);

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

    const respLine = document.createElement('div');
    respLine.className = 'term-resp';
    respLine.textContent = response;
    output.appendChild(respLine);

    // Trim to max lines
    while (output.children.length > MAX_LINES * 2) {
      output.removeChild(output.firstChild);
    }

    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
