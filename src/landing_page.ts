export function renderLandingPage(workerUrl: string): string {
  const baseUrl = workerUrl.replace(/\/$/, "");
  const mcpUrl = `${baseUrl}/mcp`;

  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Effect AI Math Console | Ali Almahdi</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/mathjs@15.1.0/lib/browser/math.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        indigo: {
                            50: '#f5f7ff',
                            100: '#ebf0fe',
                            600: '#4f46e5',
                            700: '#4338ca',
                        },
                        zinc: {
                            950: '#09090b',
                        }
                    }
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer base {
            body { @apply bg-zinc-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-200 transition-colors duration-200; }
        }
        @layer components {
            .btn-primary { @apply inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm active:scale-95; }
            .btn-secondary { @apply inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-lg font-medium transition-all shadow-sm; }
            .card { @apply bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden; }
            .code-block { @apply bg-slate-100 dark:bg-zinc-800/50 p-4 rounded-lg font-mono text-sm relative; }
            .cell-input { @apply bg-transparent w-full focus:outline-none py-1 font-mono text-indigo-600 dark:text-indigo-400 placeholder-slate-400; }
            .cell-result { @apply h-8 flex items-center px-3 font-mono text-sm bg-slate-50 dark:bg-zinc-800 rounded border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap; }
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700; }
    </style>
</head>
<body class="flex flex-col min-h-screen">
    <nav class="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="w-5 h-5">
                        <path d="M7 7h10M7 12h10M7 17h10" stroke-linecap="round"/>
                    </svg>
                </div>
                <div>
                    <h1 class="font-bold text-lg leading-tight tracking-tight">Math Console <span class="text-indigo-600 dark:text-indigo-400">MCP</span></h1>
                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Innovation Architect Edition</p>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <a href="#docs" class="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden md:block">Documentation</a>
                <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                <button id="themeToggle" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
                    <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
                </button>
                <a href="https://ali.ac" target="_blank" class="btn-secondary text-sm">
                    Visit ali.ac
                    <i data-lucide="external-link" class="w-3 h-3 ml-2"></i>
                </a>
            </div>
        </div>
    </nav>

    <main class="flex-grow max-w-[1600px] mx-auto w-full px-4 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        <!-- Sidebar: Author & Info -->
        <div class="xl:col-span-3 space-y-6 order-2 xl:order-1">
            <div class="card p-6">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-indigo-500/20">
                        <i data-lucide="user" class="w-6 h-6 text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-900 dark:text-white">Ali Almahdi</h3>
                        <p class="text-xs text-slate-500">Innovation Architect</p>
                    </div>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    Crafting at the intersection of AI and human experience. MBA-led digital transformation specialist.
                </p>
                <div class="flex gap-3">
                    <a href="https://x.com/alialmahdi" target="_blank" class="p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg hover:text-indigo-600 transition-colors">
                        <i data-lucide="twitter" class="w-4 h-4"></i>
                    </a>
                    <a href="https://linkedin.com/in/alialmahdi" target="_blank" class="p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg hover:text-indigo-600 transition-colors">
                        <i data-lucide="linkedin" class="w-4 h-4"></i>
                    </a>
                    <a href="https://github.com" target="_blank" class="p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg hover:text-indigo-600 transition-colors">
                        <i data-lucide="github" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>

            <div class="card overflow-hidden">
                <div class="px-6 py-4 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 class="font-bold text-sm">System Health</h3>
                    <span class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-500">Engine</span>
                        <span class="font-mono text-indigo-600 dark:text-indigo-400">mathjs@15.1.0</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-500">Architecture</span>
                        <span class="font-mono text-indigo-600 dark:text-indigo-400">Effect AI</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-500">Worker Protocol</span>
                        <span class="font-mono text-indigo-600 dark:text-indigo-400">JSON-RPC / HTTP</span>
                    </div>
                    <a href="/health" class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline pt-2">
                        View raw status <i data-lucide="chevron-right" class="w-3 h-3"></i>
                    </a>
                </div>
            </div>
            
            <div id="docs" class="space-y-6 pt-4">
                <h2 class="text-lg font-bold tracking-tight px-1">Documentation</h2>
                <div class="space-y-3">
                    <div class="card p-4 hover:border-indigo-400 transition-colors cursor-default group">
                        <div class="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                            <i data-lucide="wrench" class="w-4 h-4"></i>
                            <span class="font-bold text-sm">Tool: evaluate</span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            The primary tool for AI models. It accepts an <code class="bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded">expression</code> and returns the computed result.
                        </p>
                    </div>
                    <div class="card p-4 hover:border-indigo-400 transition-colors cursor-default group">
                        <div class="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                            <i data-lucide="message-square" class="w-4 h-4"></i>
                            <span class="font-bold text-sm">Prompt: help</span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Provides guidance on advanced mathjs syntax like matrix operations and vector math.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Workspace: Innovation Console -->
        <div class="xl:col-span-9 space-y-8 order-1 xl:order-2">
            <div>
                <header class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase italic">Innovator's Console</h2>
                        <p class="text-slate-500 max-w-2xl text-sm leading-relaxed">
                            A high-precision mathematical workspace powered by the same engine used in our AI MCP server. Changes made at the top propagate through the entire sheet instantly.
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button id="clearConsole" class="btn-secondary text-xs py-1.5 px-3">
                            <i data-lucide="trash-2" class="w-3 h-3 mr-2"></i> Clear
                        </button>
                        <button id="addCell" class="btn-primary text-xs py-1.5 px-3">
                            <i data-lucide="plus" class="w-3 h-3 mr-2 font-bold rotate-0 hover:rotate-90 transition-transform"></i> New Cell
                        </button>
                    </div>
                </header>

                <div class="card shadow-xl border-slate-300/60 dark:border-slate-800/60">
                    <div class="bg-slate-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div class="flex gap-1.5">
                            <div class="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700"></div>
                        </div>
                        <span class="text-[10px] font-mono uppercase font-bold text-slate-400">math-server-session_v1.0</span>
                    </div>
                    <div id="worksheet" class="p-6 space-y-4 min-h-[300px] max-h-[600px] overflow-y-auto bg-slate-50/30 dark:bg-zinc-900/30">
                        <!-- Cells injected via JS -->
                    </div>
                    <div class="px-6 py-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p class="text-[10px] text-slate-400 font-mono">Press <kbd class="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">Alt + Enter</kbd> to add new line</p>
                        <div class="flex items-center gap-4">
                             <div class="flex items-center gap-2">
                                <span class="text-[10px] uppercase font-bold text-slate-400">Session Status</span>
                                <span id="saveBadge" class="text-[10px] px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-bold uppercase tracking-wide opacity-0 transition-opacity duration-300">Saved</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Integration Hub -->
            <div class="space-y-6">
                <h2 class="text-xl font-bold tracking-tight border-b-2 border-slate-100 dark:border-slate-800 pb-2">Developer Integration</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <h3 class="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <i data-lucide="terminal" class="w-4 h-4"></i> MCP Inspector
                        </h3>
                        <div class="code-block group">
                            <pre id="inspectorCmd" class="truncate pr-8">npx @modelcontextprotocol/inspector --url ${mcpUrl}</pre>
                            <button onclick="copy('inspectorCmd')" class="absolute top-4 right-4 hover:text-indigo-400 transition-colors">
                                <i data-lucide="copy" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <p class="text-[10px] text-slate-500 font-medium px-1 italic">Run this in your terminal to debug the tools instantly.</p>
                    </div>
                    <div class="space-y-3">
                        <h3 class="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <i data-lucide="layout" class="w-4 h-4"></i> Claude Configuration
                        </h3>
                        <div class="code-block group">
                            <pre id="claudeConfig" class="whitespace-pre overflow-x-auto text-[11px] h-[72px]">{
  "mcpServers": {
    "math-innovation": {
      "url": "${mcpUrl}"
    }
  }
}</pre>
                            <button onclick="copy('claudeConfig')" class="absolute top-4 right-4 hover:text-indigo-400 transition-colors">
                                <i data-lucide="copy" class="w-4 h-4"></i>
                            </button>
                        </div>
                         <p class="text-[10px] text-slate-500 font-medium px-1 italic">Add this to your <code>claude_desktop_config.json</code>.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-950 py-12">
        <div class="max-w-[1600px] mx-auto px-4 text-center space-y-4">
            <div class="flex items-center justify-center gap-2 text-indigo-600 font-bold tracking-tight mb-2">
                <div class="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="w-4 h-4">
                        <path d="M7 7h10M7 12h10M7 17h10" stroke-linecap="round"/>
                    </svg>
                </div>
                <span>Effect AI Math Server</span>
            </div>
            <p class="text-slate-400 text-sm font-medium">Built by <a href="https://ali.ac" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">Ali Almahdi</a> — Providing reliable tech since 1999</p>
            <div class="flex justify-center gap-6 text-slate-400">
                <a href="#" class="hover:text-indigo-600 transition-colors text-xs font-semibold">Terms</a>
                <a href="#" class="hover:text-indigo-600 transition-colors text-xs font-semibold">Privacy</a>
                <a href="/health" class="hover:text-indigo-600 transition-colors text-xs font-semibold">Status</a>
            </div>
        </div>
    </footer>

    <script>
        // Init Lucide
        lucide.createIcons();

        // Theme Toggle Logic
        const html = document.documentElement;
        const themeBtn = document.getElementById('themeToggle');
        
        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'dark') html.classList.add('dark');
        else html.classList.remove('dark');

        themeBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            lucide.createIcons();
        });

        // Copy Helper
        window.copy = (id) => {
            const el = document.getElementById(id);
            navigator.clipboard.writeText(el.innerText);
            // Simple visual feedback could be added here
        };

        // --- Worksheet Engine ---
        const worksheet = document.getElementById('worksheet');
        const defaultLines = [
            '# Innovation Metrics',
            'base_efficiency = 0.72',
            'ai_multiplier = 1.45',
            'target_efficiency = base_efficiency * ai_multiplier',
            '# Unit Conversions',
            '10 cm to inch',
            '150 km/h to mile/h',
            '# Matrix Math',
            'A = [[1, 2], [3, 4]]',
            'det(A)'
        ];

        function initSession() {
            const saved = localStorage.getItem('mc_session');
            const lines = saved ? JSON.parse(saved) : defaultLines;
            lines.forEach(line => addCell(line));
            recalculate();
        }

        function createCell(value = '') {
            const cell = document.createElement('div');
            cell.className = 'group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start';
            cell.innerHTML = \`
                <div class="md:col-span-8 flex items-start gap-4">
                    <span class="text-xs font-mono text-slate-400 py-1.5 select-none w-4">#</span>
                    <input type="text" class="cell-input" value="\${value.replace(/"/g, '&quot;')}" placeholder="Enter expression..." spellcheck="false">
                </div>
                <div class="md:col-span-4 flex justify-between gap-4">
                    <div class="cell-result flex-grow"></div>
                    <button class="remove-cell opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            \`;

            const input = cell.querySelector('input');
            input.addEventListener('input', () => {
                recalculate();
                showSavedBadge();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.altKey) {
                    addCell('', cell);
                    setTimeout(() => cell.nextElementSibling.querySelector('input').focus(), 10);
                }
                if (e.key === 'Backspace' && input.value === '' && worksheet.children.length > 1) {
                    const prev = cell.previousElementSibling;
                    cell.remove();
                    if (prev) prev.querySelector('input').focus();
                    recalculate();
                }
            });

            cell.querySelector('.remove-cell').addEventListener('click', () => {
                if (worksheet.children.length > 1) {
                    cell.remove();
                    recalculate();
                }
            });

            return cell;
        }

        function addCell(value = '', after = null) {
            const cell = createCell(value);
            if (after) after.after(cell);
            else worksheet.appendChild(cell);
            lucide.createIcons();
        }

        function recalculate() {
            const parser = math.parser();
            const inputs = Array.from(worksheet.querySelectorAll('.cell-input'));
            const results = Array.from(worksheet.querySelectorAll('.cell-result'));
            const session = [];

            inputs.forEach((input, i) => {
                const expr = input.value.trim();
                session.push(expr);
                
                if (!expr) {
                    results[i].innerText = '';
                    results[i].classList.add('bg-transparent');
                    results[i].classList.remove('bg-slate-50', 'bg-red-50', 'dark:bg-red-900/20');
                    return;
                }

                if (expr.startsWith('#')) {
                    results[i].innerText = '';
                    results[i].classList.add('bg-transparent');
                    results[i].classList.remove('bg-slate-50');
                    return;
                }

                try {
                    const result = parser.evaluate(expr);
                    let formatted = '';
                    if (result === undefined) formatted = 'defined';
                    else if (typeof result === 'function') formatted = 'function';
                    else formatted = math.format(result, { precision: 14 });
                    
                    results[i].innerText = formatted;
                    results[i].classList.remove('text-red-500', 'bg-transparent');
                    results[i].classList.add('bg-slate-50', 'dark:bg-zinc-800');
                } catch (err) {
                    results[i].innerText = 'Error';
                    results[i].classList.add('text-red-500', 'bg-red-50', 'dark:bg-red-900/20');
                    results[i].classList.remove('bg-transparent');
                }
            });

            localStorage.setItem('mc_session', JSON.stringify(session));
        }

        function showSavedBadge() {
            const b = document.getElementById('saveBadge');
            b.classList.add('opacity-100');
            setTimeout(() => b.classList.remove('opacity-100'), 2000);
        }

        document.getElementById('addCell').addEventListener('click', () => {
            addCell();
            worksheet.lastElementChild.querySelector('input').focus();
        });

        document.getElementById('clearConsole').addEventListener('click', () => {
            if (confirm('Clear entire session?')) {
                worksheet.innerHTML = '';
                addCell();
                recalculate();
            }
        });

        initSession();
    </script>
</body>
</html>`;
}
