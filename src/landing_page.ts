export function renderLandingPage(workerUrl: string): string {
  const baseUrl = workerUrl.replace(/\/$/, "");
  const mcpUrl = `${baseUrl}/mcp`;

  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ali's Math MCP Server</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/mathjs@15.1.0/lib/browser/math.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
                    colors: { zinc: { 950: '#09090b' } }
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer base {
            body { @apply bg-white text-slate-900 dark:bg-zinc-950 dark:text-slate-200 transition-colors duration-200 antialiased; }
        }
        @layer components {
            .btn-primary { @apply inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm active:scale-95; }
            .btn-secondary { @apply inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-lg font-medium transition-all shadow-sm; }
            .card { @apply bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/5 rounded-xl transition-all; }
            .cell-input { @apply bg-transparent w-full focus:outline-none py-1 font-mono text-base text-slate-800 dark:text-slate-100 placeholder-slate-400; }
            .cell-inner { @apply flex flex-col gap-1 p-2 rounded-xl border border-transparent transition-all hover:bg-slate-100/50 dark:hover:bg-white/[0.02] hover:border-slate-200 dark:hover:border-white/5; }
            .result-container { @apply flex items-center gap-2 pl-4 mt-0.5 overflow-hidden transition-all; }
        }
    </style>
</head>
<body class="flex flex-col min-h-screen">
    <nav class="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <i data-lucide="sigma" class="w-5 h-5"></i>
                </div>
                <div>
                    <h1 class="font-bold text-lg">Ali's Math <span class="text-indigo-600">MCP</span> Server</h1>
                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Innovation Architect Edition</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button id="themeToggle" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg">
                    <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
                    <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
                </button>
                <a href="https://ali.ac" target="_blank" class="btn-secondary text-xs">Visit ali.ac <i data-lucide="external-link" class="w-3 h-3 ml-2"></i></a>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 text-center lg:text-left">
        <div class="lg:col-span-8 space-y-8">
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 class="text-4xl font-black tracking-tight mb-2 uppercase italic text-indigo-600">Innovator's Console</h2>
                    <p class="text-slate-500 text-sm max-w-lg">Advanced workstation for mathematical modeling and experimentation.</p>
                </div>
                <div class="flex gap-2 justify-center lg:justify-start">
                    <button id="clearConsole" class="btn-secondary text-xs"><i data-lucide="trash-2" class="w-3.5 h-3.5 mr-2 text-slate-400"></i>Clear</button>
                    <button id="addCell" class="btn-primary text-xs"><i data-lucide="plus" class="w-3.5 h-3.5 mr-2"></i>New Cell</button>
                </div>
            </header>

            <div id="worksheet" class="space-y-2 border-l-2 border-slate-100 dark:border-white/5 pl-4">
                <!-- Cells injected here -->
            </div>
            
            <div class="pt-8 border-t border-slate-100 dark:border-white/5">
                <div class="flex flex-col gap-2 items-center lg:items-start">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">MCP Server Endpoint</h3>
                    <div class="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-lg font-mono text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                        <code id="mcpUrl">${mcpUrl}</code>
                        <button onclick="copy('mcpUrl')" class="hover:text-indigo-500 transition-colors"><i data-lucide="copy" class="w-4 h-4"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-4 space-y-8">
            <section class="card p-6 scale-100 hover:scale-[1.02] cursor-default border-indigo-600/10 hover:border-indigo-600/30">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                        <i data-lucide="user-astronomical" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-900 dark:text-white">Ali Almahdi</h3>
                        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400">Innovation Architect</p>
                    </div>
                </div>
                <p class="text-xs text-slate-500 italic mb-6">"Bridging the gap between artificial intelligence and tangible human progress."</p>
                <div class="flex gap-4 justify-center lg:justify-start">
                    <a href="https://x.com/alialmahdi" target="_blank" class="text-slate-400 hover:text-indigo-500"><i data-lucide="twitter" class="w-5 h-5"></i></a>
                    <a href="https://linkedin.com/in/alialmahdi" target="_blank" class="text-slate-400 hover:text-indigo-500"><i data-lucide="linkedin" class="w-5 h-5"></i></a>
                </div>
            </section>
        </div>
    </main>

    <footer class="mt-auto border-t border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-950 py-8">
        <div class="max-w-7xl mx-auto px-6 text-center space-y-4">
            <p class="text-slate-400 text-xs font-medium tracking-tight">Built by Ali Almahdi — Providing reliable tech since 1999</p>
            <div class="flex justify-center gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-500/80">
                <a href="https://ali.ac/terms" target="_blank" class="hover:text-indigo-500 transition-colors">Terms</a>
                <span>&bull;</span>
                <a href="https://ali.ac/privacy" target="_blank" class="hover:text-indigo-500 transition-colors">Privacy</a>
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();
        const html = document.documentElement;
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (currentTheme === 'dark') html.classList.add('dark');

        document.getElementById('themeToggle').addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
            lucide.createIcons();
        });

        window.copy = (id) => {
            const el = document.getElementById(id);
            navigator.clipboard.writeText(el.innerText);
        };

        const worksheet = document.getElementById('worksheet');
        const defaultLines = ['# Growth Parameters', 'revenue = 150000', 'margin = 0.32', 'profit = revenue * margin', '# Unit Conversions', '150 km/h to mile/h', '# Linear Algebra', 'A = [[1, 2], [3, 4]]', 'det(A)'];

        function recalculate() {
            const parser = math.parser();
            const session = [];
            Array.from(worksheet.children).forEach(cell => {
                const input = cell.querySelector('input');
                const resRow = cell.querySelector('.result-container');
                const resDisplay = cell.querySelector('.cell-result');
                const val = input.value.trim();
                session.push(val);
                if (!val || val.startsWith('#')) {
                    resRow.classList.add('hidden');
                } else {
                    resRow.classList.remove('hidden');
                    try {
                        const result = parser.evaluate(val);
                        resDisplay.innerText = result === undefined ? 'defined' : math.format(result, { precision: 14 });
                        resDisplay.className = 'cell-result font-bold text-indigo-600 dark:text-indigo-400 italic text-sm';
                    } catch (e) {
                        resDisplay.innerText = 'Error';
                        resDisplay.className = 'cell-result text-red-500 font-medium text-xs';
                    }
                }
            });
            localStorage.setItem('math_session', JSON.stringify(session));
        }

        function addCell(value = '', after = null) {
            const cell = document.createElement('div');
            cell.className = 'cell-inner focus-within:bg-slate-50 dark:focus-within:bg-white/[0.03] group';
            cell.innerHTML = \`
                <div class="flex items-center gap-4">
                    <div class="w-1 h-4 bg-slate-200 dark:bg-white/10 group-focus-within:bg-indigo-500 rounded-full transition-colors shrink-0"></div>
                    <input type="text" class="cell-input" value="\${value.replace(/"/g, '&quot;')}" placeholder="Command...">
                    <button class="remove-cell opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
                <div class="result-container pb-1">
                    <i data-lucide="corner-down-right" class="w-3 h-3 text-slate-300 dark:text-slate-600 mt-1 shrink-0 scale-x-[-1] opacity-60"></i>
                    <div class="cell-result truncate"></div>
                </div>\`;
            if (after) after.after(cell); else worksheet.appendChild(cell);
            lucide.createIcons({ props: { "stroke-width": 3 }, elements: [cell.querySelector('[data-lucide="corner-down-right"]'), cell.querySelector('[data-lucide="x"]')] });
            const input = cell.querySelector('input');
            input.addEventListener('input', recalculate);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.altKey) addCell('', cell), cell.nextElementSibling.querySelector('input').focus();
                if (e.key === 'Backspace' && !input.value && worksheet.children.length > 1) {
                    const prev = cell.previousElementSibling;
                    cell.remove();
                    if(prev) prev.querySelector('input').focus();
                    recalculate();
                }
            });
            cell.querySelector('.remove-cell').addEventListener('click', () => { if(worksheet.children.length > 1) cell.remove(), recalculate(); });
        }

        const saved = localStorage.getItem('math_session');
        (saved ? JSON.parse(saved) : defaultLines).forEach(l => addCell(l));
        recalculate();
        document.getElementById('addCell').addEventListener('click', () => addCell() || worksheet.lastElementChild.querySelector('input').focus());
        document.getElementById('clearConsole').addEventListener('click', () => confirm('Reset worksheet?') && (worksheet.innerHTML = '', addCell(), recalculate()));
    </script>
</body>
</html>`;
}
