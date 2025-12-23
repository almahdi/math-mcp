export function renderLandingPage(workerUrl: string): string {
  const baseUrl = workerUrl.replace(/\/$/, "");
  const mcpUrl = `${baseUrl}/mcp`;

  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ali's Math MCP Server</title>
    <meta name="description" content="A powerful Math MCP (Model Context Protocol) server with an interactive console. Perform complex calculations, unit conversions, and linear algebra with math.js integration.">
    <meta property="og:title" content="Ali's Math MCP Server">
    <meta property="og:description" content="Interactive mathematical console powered by mathjs and MCP. Stateful calculations with real-time results.">
    <meta property="og:type" content="website">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
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
        <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <i data-lucide="sigma" class="w-5 h-5"></i>
                </div>
                <div>
                    <h1 class="font-bold text-lg leading-tight">Ali's Math <span class="text-indigo-600">MCP</span></h1>
                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Powerful Math for AI</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button id="themeToggle" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg" aria-label="Toggle dark mode">
                    <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
                    <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
                </button>
                <a href="https://ali.ac" target="_blank" class="btn-secondary text-xs">Visit ali.ac <i data-lucide="external-link" class="w-3 h-3 ml-2"></i></a>
            </div>
        </div>
    </nav>

    <main class="max-w-5xl mx-auto w-full px-6 py-12 flex-grow space-y-12">
        <section class="space-y-6">
            <div class="text-center space-y-4 max-w-2xl mx-auto">
                <h2 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">What is This?</h2>
                <p class="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                    A <strong class="text-indigo-600 dark:text-indigo-400">Math MCP Server</strong> that provides powerful mathematical capabilities to AI assistants. It offers an interactive console for calculations, unit conversions, linear algebra, and more—powered by the robust math.js library.
                </p>
                <div class="flex flex-wrap justify-center gap-3 text-xs font-medium">
                    <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">Stateful Calculations</span>
                    <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">Unit Conversions</span>
                    <span class="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">Linear Algebra</span>
                    <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">MCP Protocol</span>
                </div>
            </div>

            <div class="text-center space-y-2">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Keyboard Shortcuts</p>
                <div class="flex justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span class="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded">Alt + Enter: New Cell</span>
                    <span class="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded">Backspace on empty: Delete</span>
                </div>
            </div>
        </section>

        <section class="space-y-8">
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 class="text-3xl font-black tracking-tight mb-2 uppercase italic text-indigo-600">Innovator's Console</h2>
                    <p class="text-slate-500 text-sm max-w-lg">Stateful mathematical workstation powered by mathjs.</p>
                </div>
                <div class="flex gap-2">
                    <button id="clearConsole" class="btn-secondary text-xs"><i data-lucide="trash-2" class="w-3.5 h-3.5 mr-2 text-slate-400"></i>Clear</button>
                    <button id="addCell" class="btn-primary text-xs"><i data-lucide="plus" class="w-3.5 h-3.5 mr-2"></i>New Cell</button>
                </div>
            </header>

            <div id="worksheet" class="space-y-2 border-l-2 border-slate-100 dark:border-white/5 pl-4">
                <!-- Cells injected here -->
            </div>
        </section>

        <section class="pt-8 border-t border-slate-100 dark:border-white/5">
            <div class="flex flex-col gap-2 items-center lg:items-start">
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">MCP Server Endpoint</h3>
                <div class="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-lg font-mono text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                    <code id="mcpUrl">${mcpUrl}</code>
                    <button onclick="copy('mcpUrl')" class="hover:text-indigo-500 transition-colors" aria-label="Copy MCP URL"><i data-lucide="copy" class="w-4 h-4"></i></button>
                </div>
            </div>
        </section>
    </main>

    <footer class="border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-zinc-950/50 py-16">
        <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="space-y-6 text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <i data-lucide="user-astronomical" class="w-8 h-8"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-2xl text-slate-900 dark:text-white leading-tight">Ali Almahdi</h3>
                        <p class="text-xs uppercase tracking-[0.2em] font-bold text-indigo-600 dark:text-indigo-400">Innovation Architect</p>
                    </div>
                </div>
                <blockquote class="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0 font-medium">
                    "Bridging the gap between artificial intelligence and tangible human progress."
                </blockquote>
                <div class="flex justify-center md:justify-start gap-4">
                    <a href="https://x.com/alialmahdi" target="_blank" class="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-400 hover:text-indigo-500 transition-all hover:shadow-md"><i data-lucide="twitter" class="w-5 h-5"></i></a>
                    <a href="https://linkedin.com/in/alialmahdi" target="_blank" class="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-400 hover:text-indigo-500 transition-all hover:shadow-md"><i data-lucide="linkedin" class="w-5 h-5"></i></a>
                    <a href="https://ali.ac" target="_blank" class="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-400 hover:text-indigo-500 transition-all hover:shadow-md"><i data-lucide="globe" class="w-5 h-5"></i></a>
                </div>
            </div>
            
            <div class="flex flex-col items-center md:items-end space-y-6 text-center md:text-right border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-12 md:pt-0 md:pl-12">
                <p class="text-slate-400 text-sm font-medium leading-loose max-w-xs">
                    Ali's Math MCP Server — providing reliable, high-precision mathematical infrastructure for AI systems.
                </p>
                <div class="flex gap-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                    <a href="https://ali.ac/terms" target="_blank" class="hover:text-indigo-600 transition-colors">Terms</a>
                    <a href="https://ali.ac/privacy" target="_blank" class="hover:text-indigo-600 transition-colors">Privacy</a>
                    <a href="/health" class="hover:text-indigo-600 transition-colors">Status</a>
                </div>
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
                    <input type="text" class="cell-input" value="\${value.replace(/"/g, '&quot;')}" placeholder="Command..." aria-label="Enter mathematical expression">
                    <button class="remove-cell opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity" aria-label="Remove cell"><i data-lucide="x" class="w-4 h-4"></i></button>
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
