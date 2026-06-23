import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  Code, 
  Play, 
  RotateCcw, 
  Cpu, 
  Layers, 
  Database, 
  Activity, 
  Copy, 
  Check, 
  FileCode, 
  Eye, 
  Monitor, 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle,
  FolderDot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
type PlaygroundSubTab = "terminal" | "html-live" | "js-sandbox" | "automator";

interface PresetScript {
  id: string;
  name: string;
  type: "html" | "js";
  description: string;
  code: string;
}

const PRESET_SCRIPTS: PresetScript[] = [
  {
    id: "html-table",
    name: "Tabela de Notas Fiscais Sefaz",
    type: "html",
    description: "Esqueleto HTML + CSS para renderização de notas autorizadas com badge dinâmico.",
    code: `<div style="font-family: sans-serif; background: #0A0D14; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; color: #f1f5f9; max-width: 500px; margin: 10px auto; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 10px; margin-bottom: 15px;">
    <h3 style="margin: 0; color: #10b981; font-size: 16px;">🔍 KoreNexus XML Inspector</h3>
    <span style="font-size: 11px; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 8px; border-radius: 99px; font-weight: bold;">AUTORIZADA</span>
  </div>
  
  <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 8px 0; color: #94a3b8;">Chave SEFAZ:</td>
      <td style="text-align: right; font-family: monospace; color: #a8ff53;">35260655...11001</td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 8px 0; color: #94a3b8;">Emitente CNPJ:</td>
      <td style="text-align: right; color: #f1f5f9;">55.119.893/0001-26</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #94a3b8;">Protocolo:</td>
      <td style="text-align: right; font-family: monospace; color: #60a5fa;">1352609384511</td>
    </tr>
  </table>
  
  <button onclick="alert('Iniciando transferência direta com Banco Central!')" style="width: 100%; margin-top: 15px; background: #2563eb; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;">
    Disparar Webhook Integrado
  </button>
</div>`
  },
  {
    id: "html-starfield",
    name: "Canvas Matrix Digital",
    type: "html",
    description: "Efeito Matrix retro-futurista animado via canvas e JavaScript puro.",
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #000; margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ01";
    const charArr = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
    
    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#A8FF53";
      ctx.font = fontSize + "px monospace";
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    
    setInterval(draw, 33);
  </script>
</body>
</html>`
  },
  {
    id: "js-fibonacci",
    name: "Gerador Faturamento Recursivo",
    type: "js",
    description: "Iterador matemático complexo simulando projeção de lucratividade corporativa.",
    code: `// Simulação matemática de projeção operacional para KoreNexus ERP
function calcularLucroProjetado(meses) {
  console.log("==> Iniciando simulação de faturamento recorrente...");
  let anterior = 150000; // Faturamento inicial R$ 150.000
  let atual = 175000;
  console.log("Mês 1 (Base): R$ " + anterior.toLocaleString("pt-BR"));
  console.log("Mês 2: R$ " + atual.toLocaleString("pt-BR"));
  
  for (let i = 3; i <= meses; i++) {
    // Crescimento orgânico de 12% + fator de aceleração
    let proximo = Math.round((atual * 1.12) + (anterior * 0.05));
    anterior = atual;
    atual = proximo;
    console.log("Mês " + i + ": R$ " + atual.toLocaleString("pt-BR") + " (Crescimento de " + (((proximo - anterior)/anterior)*100).toFixed(1) + "%)");
  }
  
  return atual;
}

const resultadoFinal = calcularLucroProjetado(8);
console.log("\\n📊 Faturamento anual residual estimado: R$ " + resultadoFinal.toLocaleString("pt-BR"));`
  },
  {
    id: "js-schema",
    name: "Validador Dinâmico de Esquemas SQL",
    type: "js",
    description: "Gera e sanitiza queries relacionais a partir de objetos estruturados.",
    code: `// Validador de esquemas de banco de dados SQL KoreNexus
const tabelasNecessarias = ["usuarios", "nfe_autorizadas", "logs_comunicacao"];
console.log("📡 Escaneando compatibilidade de banco de dados...");

function verificarDDL(tabelas) {
  tabelas.forEach(table => {
    console.log("-> Verificando estrutura para [CREATE TABLE if not exists " + table + "]...");
    if (table.includes("nfe")) {
      console.log("   [Sucesso] Chaves estrangeiras e índices Sefaz indexados.");
    } else {
      console.log("   [Sucesso] Tabela normalizada em 3ª Forma Normal (3FN).");
    }
  });
  console.log("\\n✅ Banco de dados sincronizado e alinhado com o barramento Cloud Run!");
}

verificarDDL(tabelasNecessarias);`
  }
];

export function PlaygroundPage() {
  const [activeSubTab, setActiveSubTab] = useState<PlaygroundSubTab>("terminal");
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  // Termux state
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Termux v0.118-Nexus Initialized.",
    "Buscando dependências locais no barramento KoreNexus...",
    "Conectado ao Cloud Run: dev-environment @ ports/3000",
    "Digite 'help' para visualizar todos os comandos disponíveis.",
    ""
  ]);
  const [currentCmd, setCurrentCmd] = useState("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  
  // Custom script editor states
  const [htmlCode, setHtmlCode] = useState(PRESET_SCRIPTS[0].code);
  const [jsCode, setJsCode] = useState(PRESET_SCRIPTS[2].code);
  
  // JS Sandbox output states
  const [jsOutputLog, setJsOutputLog] = useState<string[]>([
    "Pressione o botão 'Executar Script' para rodar seu Javascript..."
  ]);
  const [isRunningJs, setIsRunningJs] = useState(false);

  // Automator states
  const [apiRoute, setApiRoute] = useState("/api/health");
  const [requestMethod, setRequestMethod] = useState<"GET" | "POST">("GET");
  const [requestHeaders, setRequestHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [requestBody, setRequestBody] = useState('{\n  "chave_acesso": "35260655119893872630550010000128451384511001"\n}');
  const [apiResponse, setApiResponse] = useState<string>('{\n  "status": "ready",\n  "message": "Envie uma request para visualizar a resposta live"\n}');
  const [isRequesting, setIsRequesting] = useState(false);

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory]);

  // Terminal commands interpreter
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = currentCmd.trim();
    if (!cmd) return;

    const newHistory = [...terminalHistory, `~$ ${cmd}`];
    const normalizedCmd = cmd.toLowerCase();

    if (normalizedCmd === "help") {
      newHistory.push(
        "--- Comandos Termux Disponíveis ---",
        "  help           Exibe esta lista de ajuda",
        "  ls             Lista arquivos e scripts de teste no diretório",
        "  clear          Limpa o console do terminal",
        "  whoami         Retorna informações do usuário autenticado no ambiente",
        "  neofetch       Apresenta informações do sistema e logotipo NEX",
        "  termux-info    Exibe informações estendidas de portas e barramento",
        "  pkg install    Instala um pacote simulado (Ex: pkg install nodejs)",
        "  cat <arquivo>  Imprime o conteúdo de um arquivo (Ex: cat index.html)",
        "  run <script>   Executa um dos scripts (Ex: run test_api.py)",
        "------------------------------------"
      );
    } else if (normalizedCmd === "clear") {
      setTerminalHistory([]);
      setCurrentCmd("");
      return;
    } else if (normalizedCmd === "ls") {
      newHistory.push(
        "📂 index.html                   (854 bytes)",
        "📂 sefaz_auth.py                 (1.2 kb)",
        "📂 test_api.py                   (634 bytes)",
        "📂 db_migrate.js                 (1.5 kb)",
        "📂 nexus_runner.sh               (341 bytes)"
      );
    } else if (normalizedCmd === "whoami") {
      newHistory.push(
        "User ID: developer-transient-nexus",
        "Role: Enterprise Admin Sefaz",
        "Permissão: Root Localhost Access (Full Suite)"
      );
    } else if (normalizedCmd === "neofetch") {
      newHistory.push(
        "      /\\_/\\       KoreNexus@Cli-Run",
        "     ( o.o )      -----------------",
        "      > ^ <       OS: Termux OS v9.8 x86_64",
        "  Nex-Terminal    Kernel: Linux 6.1.0-CloudRun-mfa",
        "   [KoreNexus]    Uptime: 2 days, 14 hours, 30 mins",
        "                  Packages: 1042 (apk), 54 (npm)",
        "                  Shell: bash 5.2.15",
        "                  Terminal: Termux-Vite-Bridge",
        "                  CPU: AMD Ryzen 9 Cloud Scaled",
        "                  Memory: 16GB ECC / 128GB Host"
      );
    } else if (normalizedCmd === "termux-info") {
      newHistory.push(
        "[INFO ESTENDIDA DO AMBIENTE]",
        "  - Porta de Entrada Externa: 3000 (Ingress)",
        "  - Gateway Interno: Nginx Configured proxy",
        "  - WebSocket Server: Ativo em ws://localhost:3000/ws",
        "  - Configuração de HMR: Desativada pelo painel central",
        "  - Direcionamento de DNS: korenexus.com.br",
        "  - Status SSL: Ativo / Let's Encrypt Corporativo"
      );
    } else if (normalizedCmd.startsWith("pkg install ")) {
      const pkg = cmd.substring(12).trim();
      newHistory.push(`[Instalando]: ${pkg}...`);
      newHistory.push(`░░░░░░░░░░ 0% ao barramento`);
      setTimeout(() => {
        setTerminalHistory(prev => [
          ...prev, 
          `[Barramento]: Baixando ${pkg} repositórios oficiais...`,
          `██████████ 100% Completo!`,
          `✅ Pacote [${pkg}] instalado com sucesso no terminal emulativo.`
        ]);
      }, 850);
    } else if (normalizedCmd.startsWith("cat ")) {
      const fileName = cmd.substring(4).toLowerCase().trim();
      if (fileName === "index.html") {
        newHistory.push(
          "<!DOCTYPE html>",
          "<html>",
          "  <head><title>KoreNexus</title></head>",
          "  <body><h1>Ambiente Host Sandbox</h1></body>",
          "</html>"
        );
      } else if (fileName === "sefaz_auth.py") {
        newHistory.push(
          "import hmac, hashlib, datetime",
          "def get_sefaz_signature(secret, payload):",
          "    key = bytes(secret, 'utf-8')",
          "    msg = bytes(payload, 'utf-8')",
          "    return hmac.new(key, msg, hashlib.sha256).hexdigest()",
          "print('Assinatura Gerada: ' + get_sefaz_signature('kore_sec_99', 'NFe35260'))"
        );
      } else {
        newHistory.push(`cat: arquivo '${fileName}' não encontrado no diretório local.`);
      }
    } else if (normalizedCmd.startsWith("run ")) {
      const scriptName = cmd.substring(4).toLowerCase().trim();
      newHistory.push(`🚀 Executando interpreter local para [${scriptName}]...`);
      setTimeout(() => {
        if (scriptName.includes("api") || scriptName.includes("py")) {
          setTerminalHistory(prev => [
            ...prev,
            "-------------------------------",
            "🔍 HTTP Live Request Test:",
            "=> GET https://api.sistemas.fazenda.sp.gov.br/v4/status",
            "=> Status Code: 200 OK (Resposta Sefaz em 24ms)",
            "=> Uptime Receita: 99.98% Estável",
            "-------------------------------"
          ]);
        } else if (scriptName.includes("db") || scriptName.includes("js")) {
          setTerminalHistory(prev => [
            ...prev,
            "-------------------------------",
            "⚙️ Banco de dados local:",
            "  - Executando schema migration v54...",
            "  - Tabela 'web_sessions' inspecionada.",
            "  - Adicionando coluna 'security_mfa_stamp'...",
            "✅ Sucesso parcial! 0 registros afetados.",
            "-------------------------------"
          ]);
        } else {
          setTerminalHistory(prev => [
            ...prev,
            "-------------------------------",
            "Runner local executado com sucesso.",
            "Saída padrão: Código compilado, nenhum erro encontrado.",
            "-------------------------------"
          ]);
        }
      }, 600);
    } else {
      newHistory.push(`bash: comando não encontrado: '${cmd}'. Digite 'help' para comandos de ajuda.`);
    }

    setTerminalHistory(newHistory);
    setCurrentCmd("");
  };

  // Run Javascript code sandbox with safe eval and captured console logs
  const runJsCode = () => {
    setIsRunningJs(true);
    const capturedLogs: string[] = [];
    const originalConsoleLog = console.log;

    // Override console.log
    console.log = function (...args: any[]) {
      capturedLogs.push(args.map(arg => 
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" "));
      originalConsoleLog.apply(console, args);
    };

    try {
      // Execute User JS Code safely
      const executor = new Function(jsCode);
      executor();
      
      if (capturedLogs.length === 0) {
        capturedLogs.push("Script executado sem nenhum output no console.log.");
      }
      setJsOutputLog(capturedLogs);
    } catch (err: any) {
      setJsOutputLog([`❌ Erro em tempo de execução:\n${err.message}`]);
    } finally {
      // Restore console.log
      console.log = originalConsoleLog;
      setIsRunningJs(false);
    }
  };

  // Custom Live-API Request automator dispatcher
  const executeApiRequest = async () => {
    setIsRequesting(true);
    setApiResponse("Enviando requisição...");
    
    try {
      const headersObj = JSON.parse(requestHeaders);
      const host = window.location.origin;
      const fullUrl = `${host}${apiRoute}`;
      
      const options: RequestInit = {
        method: requestMethod,
        headers: headersObj
      };
      
      if (requestMethod === "POST") {
        options.body = requestBody;
      }
      
      const response = await fetch(fullUrl, options);
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();
      
      setApiResponse(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers.entries()),
        payload: data
      }, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({
        error: "Falha na requisição ao backend real",
        detalhes: err.message,
        tip: "Verifique se a rota informada está declarada no server.ts."
      }, null, 2));
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCopyPreset = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase bg-[#A8FF53]/10 text-[#A8FF53] border border-[#A8FF53]/20 px-2.5 py-1 rounded-full font-bold">
            Cli Sandbox OS
          </span>
          <h1 className="text-3xl font-display font-bold text-white mt-2 tracking-tight">
            KoreNexus Playground & Terminal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Console simulado completo estilo Termux, compilador de scripts dinâmicos, testes HTML ao vivo e executor JS.
          </p>
        </div>
      </div>

      {/* Main Tab Switcher Row */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-900 pb-3" id="playground-tabs-row">
        <button
          onClick={() => setActiveSubTab("terminal")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === "terminal"
              ? "bg-[#A8FF53]/10 text-[#A8FF53] border border-[#A8FF53]/30"
              : "bg-slate-900/50 text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          <TerminalIcon className="h-4 w-4 shrink-0" />
          <span>termux-emulator</span>
        </button>
        <button
          onClick={() => setActiveSubTab("html-live")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === "html-live"
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
              : "bg-slate-900/50 text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          <Monitor className="h-4 w-4 shrink-0" />
          <span>live-canvas-html</span>
        </button>
        <button
          onClick={() => setActiveSubTab("js-sandbox")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === "js-sandbox"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              : "bg-slate-900/50 text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          <Code className="h-4 w-4 shrink-0" />
          <span>js-engine-sandbox</span>
        </button>
        <button
          onClick={() => setActiveSubTab("automator")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === "automator"
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
              : "bg-slate-900/50 text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          <Activity className="h-4 w-4 shrink-0" />
          <span>real-endpoints-api</span>
        </button>
      </div>

      {/* RENDER INTERNAL SUB-TABS */}
      <div className="bg-[#0b0f19]/80 border border-slate-850 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-xl">
        <AnimatePresence mode="wait">
          
          {/* SUB-TAB 1: Interactive Termux-Style Terminal */}
          {activeSubTab === "terminal" && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <div className="flex items-center gap-2 font-mono">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-400 ml-1">bash terminal@korenexus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-[10px] text-gray-500 font-mono font-bold">Cloud Sandbox OK</span>
                </div>
              </div>

              {/* Terminal screen container */}
              <div 
                className="w-full bg-[#03060c] border border-gray-900 rounded-xl p-4 h-96 overflow-y-auto font-mono text-[11.5px] leading-relaxed text-[#A8FF53] shadow-inner custom-scrollbar"
                onClick={() => document.getElementById("terminal-input")?.focus()}
              >
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">
                    {line.startsWith("~$") ? (
                      <div>
                        <span className="text-emerald-400 font-bold">~ $ </span>
                        <span className="text-white font-semibold">{line.substring(3)}</span>
                      </div>
                    ) : line.startsWith("[Instalando]") || line.startsWith("[Sucesso]") || line.startsWith("✅") ? (
                      <span className="text-[#A8FF53]">{line}</span>
                    ) : line.startsWith("📂") ? (
                      <span className="text-blue-400">{line}</span>
                    ) : line.startsWith("bash: ") ? (
                      <span className="text-rose-400">{line}</span>
                    ) : (
                      <span className="text-gray-300">{line}</span>
                    )}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              {/* Interactive Cmd Input form */}
              <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-emerald-400 font-semibold text-xs">~$</span>
                  <input
                    id="terminal-input"
                    type="text"
                    autoComplete="off"
                    value={currentCmd}
                    onChange={(e) => setCurrentCmd(e.target.value)}
                    className="w-full bg-[#03060c] border border-gray-900 p-3 pl-8 text-xs font-mono text-white rounded-xl focus:outline-none focus:border-[#A8FF53]/50"
                    placeholder="Digite seu comando aqui (ex: help, ls, neofetch, whoami)..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Play className="h-3 w-3 shrink-0" />
                  <span className="hidden sm:inline">Executar</span>
                </button>
              </form>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-900 text-gray-400 text-[10.5px] leading-tight space-y-1 font-mono">
                <p className="text-emerald-400 font-bold">💡 Atalhos Úteis e Comandos Rápidos na Sandbox:</p>
                <div className="flex flex-wrap gap-2 pt-1 font-semibold">
                  <button onClick={() => setCurrentCmd("help")} className="hover:text-white underline">help</button>
                  <span>•</span>
                  <button onClick={() => setCurrentCmd("ls")} className="hover:text-white underline">ls</button>
                  <span>•</span>
                  <button onClick={() => setCurrentCmd("neofetch")} className="hover:text-white underline">neofetch</button>
                  <span>•</span>
                  <button onClick={() => setCurrentCmd("termux-info")} className="hover:text-white underline">termux-info</button>
                  <span>•</span>
                  <button onClick={() => setCurrentCmd("pkg install nodejs")} className="hover:text-white underline">pkg install nodejs</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUB-TAB 2: Live HTML Preview Canvas */}
          {activeSubTab === "html-live" && (
            <motion.div
              key="html-live"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase">Renderizador HTML e CSS Estilo Sandbox</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHtmlCode(PRESET_SCRIPTS[0].code)}
                    className="flex items-center gap-1 px-2..5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-mono text-[10px] cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Resetar Modelo</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code input textarea */}
                <div className="space-y-2">
                  <span className="text-[10.5px] text-slate-400 font-mono font-bold block uppercase border-b border-gray-900 pb-1">Código Fonte (Editável):</span>
                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className="w-full h-[360px] bg-[#03060c] border border-gray-800 p-3 font-mono text-[11px] text-white focus:outline-none focus:border-blue-500/50 rounded-xl whitespace-pre leading-normal custom-scrollbar"
                    placeholder="Escreva aqui tag HTML, Inline CSS e JavaScript..."
                  />
                </div>

                {/* Preview frame */}
                <div className="space-y-2">
                  <span className="text-[10.5px] text-blue-450 text-blue-400 font-mono font-bold block uppercase border-b border-gray-900 pb-1 flex items-center justify-between">
                    <span>Visualização Live (Sandboxed Iframe):</span>
                    <span className="text-[9px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">Responsivo</span>
                  </span>
                  
                  {/* Embedded static render buffer */}
                  <div className="w-full h-[360px] bg-white rounded-xl border border-gray-800 overflow-hidden relative">
                    <iframe
                      title="HTML Sandbox Playground Frame"
                      sandbox="allow-scripts allow-modals allow-same-origin"
                      srcDoc={htmlCode}
                      className="w-full h-full border-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preset scripts presets list to select from */}
              <div className="space-y-2 pt-3 border-t border-gray-900">
                <h4 className="text-[10.5px] font-mono font-bold text-slate-400 uppercase">Selecione um Preset de Template HTML para Testar:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRESET_SCRIPTS.filter(s => s.type === "html").map(s => (
                    <div key={s.id} className="bg-slate-950/50 p-3 rounded-xl border border-gray-900 flex justify-between items-start gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-white font-mono">{s.name}</h5>
                        <p className="text-[10.5px] text-gray-400 mt-1">{s.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setHtmlCode(s.code);
                          }}
                          className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-semibold rounded font-mono cursor-pointer transition-all"
                        >
                          Carregar
                        </button>
                        <button
                          onClick={() => handleCopyPreset(s.code, s.id)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          title="Copiar"
                        >
                          {copiedScriptId === s.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUB-TAB 3: JavaScript Compiler Sandboxed */}
          {activeSubTab === "js-sandbox" && (
            <motion.div
              key="js-sandbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase font-sans">Compilador e Executável JavaScript (JS ES6 Engine)</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setJsCode(PRESET_SCRIPTS[2].code)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/20 text-amber-400 font-mono text-[10px]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Resetar Código</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Editor input */}
                <div className="space-y-2">
                  <span className="text-[10.5px] text-slate-400 font-mono font-bold block uppercase border-b border-gray-900 pb-1">Escreva código Javascript válido:</span>
                  <textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    className="w-full h-80 bg-[#03060c] border border-gray-800 p-4 font-mono text-[11px] text-white focus:outline-none focus:border-amber-500/50 rounded-xl whitespace-pre leading-normal custom-scrollbar"
                    placeholder="Escrava funções, lógicas de repetição ou cálculos..."
                  />
                  <button
                    onClick={runJsCode}
                    disabled={isRunningJs}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isRunningJs ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                        <span>Compilando script...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>Executar código Script</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Console Log outputs container */}
                <div className="space-y-2">
                  <span className="text-[10.5px] text-amber-500 font-mono font-bold block uppercase border-b border-gray-900 pb-1 flex items-center justify-between">
                    <span>Console Log Standard Outputs:</span>
                    <button
                      onClick={() => setJsOutputLog(["Pressione o botão 'Executar Script' para rodar..."])}
                      className="text-[9px] hover:underline cursor-pointer"
                    >
                      Limpar log
                    </button>
                  </span>
                  
                  <div className="w-full h-[375px] bg-[#03060c] rounded-xl border border-gray-800 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#A8FF53] whitespace-pre-wrap custom-scrollbar">
                    {jsOutputLog.map((log, idx) => (
                      <div key={idx} className="mb-1 border-b border-gray-950/30 pb-1 last:border-none">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* JS Templates options */}
              <div className="space-y-2 pt-3 border-t border-gray-900">
                <h4 className="text-[10.5px] font-mono font-bold text-slate-400 uppercase">Modelos Rápidos Javascript de Teste:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRESET_SCRIPTS.filter(s => s.type === "js").map(s => (
                    <div key={s.id} className="bg-slate-950/50 p-3 rounded-xl border border-gray-900 flex justify-between items-start gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-white font-mono">{s.name}</h5>
                        <p className="text-[10.5px] text-gray-400 mt-1">{s.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setJsCode(s.code);
                          }}
                          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] font-semibold rounded font-mono cursor-pointer transition-all"
                        >
                          Carregar
                        </button>
                        <button
                          onClick={() => handleCopyPreset(s.code, s.id)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {copiedScriptId === s.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUB-TAB 4: Real Endpoint Request Testing Engine */}
          {activeSubTab === "automator" && (
            <motion.div
              key="automator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase">Live API Dispatcher (Ambiente Real / Port 3000)</h3>
                </div>
                <span className="text-[10px] text-purple-400 font-mono font-bold">Proxy Real de Rotas Express</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Method / Paths settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">Método</label>
                      <select
                        value={requestMethod}
                        onChange={(e: any) => setRequestMethod(e.target.value)}
                        className="w-full bg-[#03060c] border border-gray-800 p-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1 font-sans">Rota do Endpoint</label>
                      <input
                        type="text"
                        value={apiRoute}
                        onChange={(e) => setApiRoute(e.target.value)}
                        className="w-full bg-[#03060c] border border-gray-800 p-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-purple-500/50"
                        placeholder="/api/health"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Headers JSON:</span>
                    <textarea
                      value={requestHeaders}
                      onChange={(e) => setRequestHeaders(e.target.value)}
                      className="w-full h-24 bg-[#03060c] border border-gray-800 p-2 font-mono text-[10.5px] text-[#A8FF53] focus:outline-none focus:border-purple-500/50 rounded-lg custom-scrollbar"
                    />
                  </div>

                  {requestMethod === "POST" && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Request Body JSON:</span>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="w-full h-24 bg-[#03060c] border border-gray-800 p-2 font-mono text-[10.5px] text-[#A8FF53] focus:outline-none focus:border-purple-500/50 rounded-lg custom-scrollbar"
                      />
                    </div>
                  )}

                  <button
                    onClick={executeApiRequest}
                    disabled={isRequesting}
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Activity className="h-3.5 w-3.5 shrink-0" />
                    <span>Disparar Requisição Real HTTP</span>
                  </button>
                </div>

                {/* API Response display */}
                <div className="space-y-2">
                  <span className="text-[10.5px] text-purple-400 font-mono font-bold block uppercase border-b border-gray-900 pb-1 flex justify-between items-center">
                    <span>Resultado Resposta JSON Real:</span>
                    <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-purple-300">Live Server</span>
                  </span>
                  <pre className="w-full h-80 bg-[#03060c] rounded-xl border border-gray-800 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-cyan-400 custom-scrollbar">
                    {apiResponse}
                  </pre>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-900 font-mono text-[10.5px] text-gray-400 space-y-1">
                <span className="text-purple-400 font-bold">⚡ Rotas Disponíveis para Teste Real no seu Servidor:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-bold">
                  <button 
                    onClick={() => {
                      setApiRoute("/api/health");
                      setRequestMethod("GET");
                    }} 
                    className="text-left text-blue-400 hover:underline"
                  >
                    GET /api/health (Inspecionar status)
                  </button>
                  <button 
                    onClick={() => {
                      setApiRoute("/api/status/uf");
                      setRequestMethod("GET");
                    }} 
                    className="text-left text-blue-400 hover:underline"
                  >
                    GET /api/status/uf (Consulta de status por estado)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
