import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Cpu, 
  Code, 
  Activity, 
  Play, 
  Check, 
  Copy, 
  Terminal, 
  TrendingUp, 
  Clock, 
  FileCode, 
  BarChart2, 
  Sparkles,
  RefreshCw,
  X,
  ExternalLink,
  Maximize2,
  Minimize2,
  Key,
  Lock
} from "lucide-react";
import KoreNexusWidget from "./KoreNexusWidget";

interface PresetPrompt {
  id: string;
  title: string;
  prompt: string;
  response: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: "p1",
    title: "⚡ Ordenação de Array (Python)",
    prompt: "Escreva uma função rápida de Bubble Sort em Python com comentários exemplificando o pior caso.",
    response: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        # flag para otimização se o array já estiver ordenado\n        swapped = False\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n\n# PIOR CASOS: Array invertido O(n²)\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`
  },
  {
    id: "p2",
    title: "📊 Análise de Risco Comercial",
    prompt: "Quais os 3 principais fatores de risco ao escalar um software de logística de cargas industriais?",
    response: `1. LATÊNCIA E DESCONEXÃO: Falhas de rede móvel em rodovias exigindo arquitetura offline-first integrada.\n2. CONFLITOS DE DOCAMENTO (DOUBLE BOOKING): Mudanças dinâmicas de carga no gate exigindo readequação imediata.\n3. CONFORMIDADE FISCAL (MDF-e/CT-e): Instabilidade de SEFAZs estaduais interrompendo despachos urgentes de cargas.`
  },
  {
    id: "p3",
    title: "📨 Resposta de E-mail Executivo",
    prompt: "Gere um e-mail formal pedindo prorrogação de prazo de briefing técnico.",
    response: `Prezada equipe técnico-comercial,\n\nGostaria de solicitar uma breve prorrogação no envio do briefing do projeto de faturamento integrado.\n\nCom o objetivo de refinar os testes de volumetria e garantir que a modelagem contemple todas as exceções regulatórias, necessitamos de mais 48 horas úteis.\n\nAgradeço a compressão.\n\nAtenciosamente,\nEngenharia KoreNexus.`
  }
];

export default function KflowPage() {
  const [activePrompt, setActivePrompt] = useState<PresetPrompt>(PRESET_PROMPTS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [isFullScreenOverlay, setIsFullScreenOverlay] = useState(false);

  // Keyboard and scroll lock for the full-screen widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullScreenOverlay(false);
      }
    };
    if (isFullScreenOverlay) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullScreenOverlay]);
  
  // Terminal outputs
  const [kflowOutput, setKflowOutput] = useState("");
  const [gpuOutput, setGpuOutput] = useState("");
  
  // Timing parameters
  const [kflowTime, setKflowTime] = useState(0);
  const [gpuTime, setGpuTime] = useState(0);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState("curl");

  // Keep cancellation refs
  const kflowIntervalRef = useRef<any>(null);
  const gpuIntervalRef = useRef<any>(null);

  const handleCopy = (code: string, tabId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(tabId);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const startSimulation = () => {
    // Clear existing
    if (kflowIntervalRef.current) clearInterval(kflowIntervalRef.current);
    if (gpuIntervalRef.current) clearInterval(gpuIntervalRef.current);

    setIsRunning(true);
    setKflowOutput("");
    setGpuOutput("");
    setKflowTime(0);
    setGpuTime(0);

    const fullResponse = activePrompt.response;
    const words = fullResponse.split(" ");
    
    // Kflow simulation - Super Fast (~450 tok/s - renders 4 words per tick at a very rapid interval)
    let kIndex = 0;
    const kflowStart = performance.now();
    kflowIntervalRef.current = setInterval(() => {
      if (kIndex < words.length) {
        setKflowOutput(prev => prev + (prev ? " " : "") + words.slice(kIndex, kIndex + 4).join(" "));
        kIndex += 4;
        setKflowTime(Math.round(performance.now() - kflowStart) + 12); // Add TTFT offset
      } else {
        clearInterval(kflowIntervalRef.current);
      }
    }, 18);

    // Standard GPU simulation - Standard Slow (~30 tok/s - renders 1 word per tick at a slower interval)
    let gIndex = 0;
    const gpuStart = performance.now();
    gpuIntervalRef.current = setInterval(() => {
      if (gIndex < words.length) {
        setGpuOutput(prev => prev + (prev ? " " : "") + words[gIndex]);
        gIndex += 1;
        setGpuTime(Math.round(performance.now() - gpuStart) + 210); // Add standard cold TTFT
      } else {
        clearInterval(gpuIntervalRef.current);
        setIsRunning(false);
      }
    }, 70);
  };

  // Run simulation once on mount or prompt change
  useEffect(() => {
    startSimulation();
    return () => {
      if (kflowIntervalRef.current) clearInterval(kflowIntervalRef.current);
      if (gpuIntervalRef.current) clearInterval(gpuIntervalRef.current);
    };
  }, [activePrompt]);

  const codeSnippets: Record<string, string> = {
    curl: `curl https://api.knexus.qzz.io/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer kflow_sk_live_xxxx" \\
  -d '{
    "model": "k-llama-3.1-70b-instruct",
    "messages": [{"role": "user", "content": "${activePrompt.prompt}"}],
    "temperature": 0.4,
    "stream": false
  }'`,
    node: `import OpenAI from "openai";

const kflow = new OpenAI({
  baseURL: "https://api.knexus.qzz.io/v1",
  apiKey: "kflow_sk_live_xxxx",
});

async function main() {
  const completion = await kflow.chat.completions.create({
    model: "k-llama-3.1-70b-instruct",
    messages: [
      { role: "user", content: "${activePrompt.prompt}" }
    ],
    temperature: 0.4
  });

  console.log(completion.choices[0].message.content);
}

main();`,
    python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.knexus.qzz.io/v1",
    api_key="kflow_sk_live_xxxx"
)

completion = client.chat.completions.create(
    model="k-llama-3.1-70b-instruct",
    messages=[
        {"role": "user", "content": "${activePrompt.prompt}"}
    ],
    temperature=0.4
)

print(completion.choices[0].message.content)`
  };

  return (
    <div className="space-y-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-gray-800 bg-[#0A0D14]" id="kflow-hero">
        <div className="absolute inset-0 bg-[radial-gradient(#1e1e38_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/15 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400">
            <Zap className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>Kflow Model Inference Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight font-sans">
            Kflow: A API de IA mais rápida do mercado. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Mais de 450 Tokens/seg.</span>
          </h1>

          <p className="text-sm md:text-md text-slate-300 leading-relaxed font-sans max-w-3xl">
            Processe redes neurais e modelos open-weight sofisticados com velocidades instantâneas. Reduza o tempo de resposta de agentes inteligentes de segundos para milissegundos, alcançando experiências conversacionais verdadeiramente humanas por um custo operacional surpreendente.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="text-[10px] bg-slate-900 border border-gray-800 rounded px-2.5 py-1 text-gray-400 font-mono">⚡ Time to First Token: ~12ms</span>
            <span className="text-[10px] bg-slate-900 border border-gray-800 rounded px-2.5 py-1 text-gray-400 font-mono">🎯 Equivalência OpenAI / Anthropic</span>
            <span className="text-[10px] bg-slate-900 border border-gray-800 rounded px-2.5 py-1 text-gray-400 font-mono">📦 LPU Hardware Architecture Co-located</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="korenexus-btn"
              onClick={() => setShowWidgetModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-full text-xs transition duration-250 shadow-lg shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Key className="h-4 w-4 text-white animate-pulse" />
              <span>Acessar Painel KoreNexus</span>
            </button>

            <button
              id="korenexus-launch"
              onClick={() => setIsFullScreenOverlay(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold rounded-full text-xs transition duration-250 shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Lock className="h-4 w-4 text-white" />
              <span>Abrir KoreNexus</span>
            </button>
            
            <a
              href="https://k-flow-nexus.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-900 border border-gray-800 hover:bg-slate-850 hover:text-white text-slate-350 text-xs font-semibold rounded-full flex items-center gap-2 transition whitespace-nowrap cursor-pointer"
            >
              <span>Abrir Canal Externo</span>
              <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
            </a>
          </div>
        </div>
      </div>

      {/* SECTION: INTERACTIVE SPEED TEST ARENA (GROQ CONCEPT) */}
      <div className="space-y-4">
        <div>
          <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">COMPARADOR EM TEMPO REAL</span>
          <h2 className="text-xl font-display font-bold text-white">Arena de Latência e Vazão Visual</h2>
          <p className="text-xs text-gray-400 mt-1">Selecione um prompt abaixo para verificar o desempenho imediato do pipeline de aceleração Kflow.</p>
        </div>

        {/* Prompt selectors on screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_PROMPTS.map((p) => (
            <button
              key={p.id}
              disabled={isRunning}
              onClick={() => setActivePrompt(p)}
              className={`p-3 text-left border rounded-2xl transition-all cursor-pointer ${
                activePrompt.id === p.id 
                  ? "border-indigo-500 bg-indigo-500/5 text-white" 
                  : "border-gray-800 bg-[#111622]/50 text-gray-400 hover:text-gray-200"
              }`}
            >
              <h4 className="text-xs font-semibold">{p.title}</h4>
              <p className="text-[10px] text-gray-500 truncate mt-1">{p.prompt}</p>
            </button>
          ))}
        </div>

        {/* Prompt Input Show Box */}
        <div className="bg-[#111622] border border-gray-800 p-4 rounded-3xl flex items-center justify-between gap-4 font-sans text-xs">
          <div className="flex items-center gap-2.5">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300">Prompt de Teste:</span>
            <code className="text-[11px] text-gray-400 italic break-all">"{activePrompt.prompt}"</code>
          </div>

          <button
            disabled={isRunning}
            onClick={startSimulation}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3 w-3 ${isRunning ? "animate-spin" : ""}`} />
            Re-executar Teste
          </button>
        </div>

        {/* Dynamic Sandbox Terminals Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TERMINAL 1: KFLOW (LPU CORE) */}
          <div className="bg-[#0A0D14] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between h-[360px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                  <span className="text-xs font-mono font-bold text-indigo-400">KFLOW neural ENGINE (LPU Stack)</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">🚀 ~472 Tok/s</span>
              </div>

              {/* Text content screen */}
              <div className="text-[11px] text-slate-100 font-mono leading-relaxed h-[220px] overflow-y-auto whitespace-pre-wrap font-semibold">
                {kflowOutput || <span className="text-gray-650 italic font-medium">// Aguardando processamento...</span>}
              </div>
            </div>

            {/* Performance status */}
            <div className="border-t border-gray-850 pt-3 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Time-To-First-Token: <strong className="text-indigo-400">12ms</strong></span>
              <span>Tempo operacional: <strong className="text-white">{kflowTime ? `${(kflowTime/1000).toFixed(2)}s` : "0.00s"}</strong></span>
            </div>
          </div>

          {/* TERMINAL 2: STANDARD CLOUD (GPU CORE) */}
          <div className="bg-[#0A0D14] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between h-[360px] opacity-80">
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                  <span className="text-xs font-mono text-gray-400">MARKET PROVIDERS (Standard GPU Cloud)</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">🐢 ~34 Tok/s</span>
              </div>

              {/* Text content screen */}
              <div className="text-[11px] text-slate-400 font-mono leading-relaxed h-[220px] overflow-y-auto whitespace-pre-wrap">
                {gpuOutput || <span className="text-gray-650 italic">// Aguardando processamento...</span>}
              </div>
            </div>

            {/* Performance status */}
            <div className="border-t border-gray-850 pt-3 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Time-To-First-Token: <strong className="text-gray-400">210ms</strong></span>
              <span>Tempo operacional: <strong className="text-white">{gpuTime ? `${(gpuTime/1000).toFixed(2)}s` : "0.00s"}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* GRAPHICAL COMPARISON WITH STANDARD NETWORKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111622] border border-gray-800 rounded-3xl p-6 md:p-8">
        
        {/* Left explanation - 5 cols */}
        <div className="lg:col-span-5 space-y-4 font-sans text-xs">
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">VELOCIDADE RADICAL</span>
          <h3 className="text-lg font-display font-bold text-white leading-snug">Como superamos a nuvem tradicional?</h3>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            Em vez de rotear chamadas de IA para aceleradores gráficos de propósito geral (GPUs) projetados para desenhar jogos 3D, o pipeline de computação da KoreNexus dedica hardware específico otimizado estritamente para sequenciamento sintático.
          </p>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            Isso elimina a latência de transferência de memória de silício e as barreiras de cache de kernel, repassando o resultado direto para sua aplicação via conexões HTTP de baixa latência em todo o território nacional.
          </p>
        </div>

        {/* Right Charts - 7 cols */}
        <div className="lg:col-span-7 space-y-6 font-sans">
          
          {/* STATS BAR 1: Throughput */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-300">
              <span>Taxa de Resposta (Vazão do Modelo) • Mais é melhor</span>
              <span className="font-mono text-indigo-400 font-bold">Tokens por segundo</span>
            </div>
            
            <div className="space-y-2 bg-[#0A0D14]/70 p-3 rounded-2xl border border-gray-850">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white font-bold">Kflow Model Engine</span>
                  <span className="font-mono text-indigo-400 font-bold">472 T/s</span>
                </div>
                <div className="w-full bg-[#111622] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Nuvem Provedora Padrão (GPU)</span>
                  <span className="font-mono text-slate-400">34 T/s</span>
                </div>
                <div className="w-full bg-[#111622] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 rounded-full" style={{ width: "8%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* STATS BAR 2: TTFT Latency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-300">
              <span>Time To First Token (TTFT - Tempo p/ iniciar resposta) • Menos é melhor</span>
              <span className="font-mono text-emerald-400 font-bold">Milissegundos (ms)</span>
            </div>
            
            <div className="space-y-2 bg-[#0A0D14]/70 p-3 rounded-2xl border border-gray-850">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white font-bold">Kflow Interface Gateway</span>
                  <span className="font-mono text-emerald-400 font-bold">12 ms</span>
                </div>
                <div className="w-full bg-[#111622] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "4%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Nuvem Provedora Padrão (GPU)</span>
                  <span className="font-mono text-slate-400">210 ms</span>
                </div>
                <div className="w-full bg-[#111622] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500/50 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DEVELOPER CODE SNIPPETS & INTEGRATION TAB PLAYGROUND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* API Capabilities Specs - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111622] border border-gray-800 rounded-3xl p-6 space-y-4" id="kflow-api-specs">
            <h4 className="text-sm font-sans font-bold text-white flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-400" />
              Especificações e Modelos
            </h4>

            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              O Kflow serve modelos open-weight nativamente por meio de chamadas REST plenamente compatíveis com as especificações da indústria (W3C), facilitando a migração sem reescrever seus clients.
            </p>

            <div className="space-y-2.5 font-sans">
              <div className="p-3 bg-[#0A0D14] border border-gray-850 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-semibold text-white">K-Llama 3.1 70B</h5>
                  <span className="text-[9px] text-gray-500 uppercase font-mono block">Raciocínio complexo institucional</span>
                </div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">Ativo</span>
              </div>

              <div className="p-3 bg-[#0A0D14] border border-gray-850 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-semibold text-white">K-Mixtral 8x7B</h5>
                  <span className="text-[9px] text-gray-500 uppercase font-mono block">Extração de dados não estruturados</span>
                </div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">Ativo</span>
              </div>

              <div className="p-3 bg-[#0A0D14] border border-gray-850 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-semibold text-white">K-Gemma 2 9B</h5>
                  <span className="text-[9px] text-gray-500 uppercase font-mono block">Estruturação leve & Resumos rápidos</span>
                </div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">Ativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Snippets Display - 7 cols */}
        <div className="lg:col-span-7 bg-[#111622] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-4">
              <div>
                <h4 className="text-sm font-sans font-bold text-white flex items-center gap-1.5">
                  <Code className="h-4.5 w-4.5 text-blue-400" />
                  Pronto para Produção (SDK Integrados)
                </h4>
                <p className="text-[10px] text-gray-400 font-sans mt-1">Compatibilidade nativa total com pacotes oficiais do ecossistema.</p>
              </div>

              {/* Code format triggers */}
              <div className="flex bg-[#0A0D14] p-0.5 rounded-full border border-gray-850 self-start sm:self-auto">
                {[
                  { id: "curl", label: "cURL" },
                  { id: "node", label: "Node.js" },
                  { id: "python", label: "Python" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveCodeTab(item.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                      activeCodeTab === item.id
                        ? "bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30"
                        : "text-gray-400 hover:text-white border border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Code pre block */}
            <div className="bg-[#0A0D14] border border-gray-850 rounded-2xl p-4 font-mono text-[10px] text-[#A5B4FC] relative overflow-x-auto min-h-[220px]">
              <pre className="select-all leading-relaxed tracking-tight whitespace-pre">
                {codeSnippets[activeCodeTab]}
              </pre>

              <button
                onClick={() => handleCopy(codeSnippets[activeCodeTab], activeCodeTab)}
                className="absolute top-3 right-3 p-1.5 bg-[#111622] border border-gray-800 text-gray-400 hover:text-white rounded-lg transition"
                title="Copiar snippet de código"
              >
                {copiedCode === activeCodeTab ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-820 flex items-center justify-between text-[11px] font-sans text-gray-400">
            <span>Para credenciais de sandbox solicite uma chave técnica comercial.</span>
            <a
              href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20solicitar%20uma%20chave%20de%20desenvolvimento%20para%20a%20API%20Kflow."
              target="_blank"
              className="text-indigo-400 hover:underline font-bold"
            >
              Obter API Key →
            </a>
          </div>
        </div>

      </div>

      {/* SEÇÃO: PORTAL DE INTEGRAÇÕES UNIVERSAL KORENEXUS */}
      <div className="space-y-6 bg-gradient-to-b from-[#0e1320] to-[#080b13] border border-gray-800 p-6 md:p-8 rounded-3xl relative overflow-hidden" id="korenexus-integration-portal">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5 font-sans">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">CONECTORES EMBEDDED</span>
            <h3 className="text-xl font-display font-bold text-white font-sans">Portal de Integrações KoreNexus</h3>
            <p className="text-xs text-gray-400 font-sans max-w-2xl">Use canais customizados ao vivo para emitir credenciais automáticas de sandbox ou logar de forma perpétua usando chaves dedicadas.</p>
          </div>
          <span className="px-2.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-[10px] font-mono font-semibold self-start md:self-auto uppercase">Active Bridge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {/* Card 1: Chave API Temporária */}
          <div className="bg-[#111622]/80 border border-gray-850 p-6 rounded-2xl flex flex-col justify-between hover:border-sky-500/35 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 group text-xs font-sans">
            <div className="space-y-4">
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl w-fit text-sky-400 group-hover:scale-110 transition duration-300">
                <Key className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                  Gerador de Chave API Temporária
                  <span className="px-1.5 py-0.5 bg-sky-500/15 text-sky-400 border border-sky-500/25 text-[8.5px] uppercase rounded font-bold font-mono">Sandbox Embed</span>
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Desenvolva e valide integrações locais em tempo real. Este canal embutido permite que seu software obtenha chaves e endpoints de curta duração para testes síncronos imediatos.
                </p>
              </div>
            </div>
            
            <div className="pt-6">
              <button
                id="korenexus-btn"
                onClick={() => setShowWidgetModal(true)}
                className="w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0aa2e0] text-white font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-sky-500/15 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-98"
              >
                <Key className="h-4 w-4 text-white" />
                <span>Acessar Painel KoreNexus</span>
              </button>
            </div>
          </div>

          {/* Card 2: Login Master com Chaves Fixas */}
          <div className="bg-[#111622]/80 border border-gray-850 p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/35 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group text-xs font-sans">
            <div className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl w-fit text-indigo-400 group-hover:scale-110 transition duration-300">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                  Console de Login Master (Chaves Fixas)
                  <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[8.5px] uppercase rounded font-bold font-mono">Full-Access</span>
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Autentique sua empresa para configurar fluxos persistentes (Kflow), canais de faturamento corporativo e visualizar telemetrias de orquestração sob chaves dedicadas.
                </p>
              </div>
            </div>
            
            <div className="pt-6">
              <button
                id="korenexus-launch"
                onClick={() => setIsFullScreenOverlay(true)}
                className="w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0aa2e0] text-white font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-sky-500/15 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-98"
              >
                <Lock className="h-4 w-4 text-white" />
                <span>Abrir KoreNexus</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/40 border border-gray-850 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-gray-400 font-mono mt-4 font-sans">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-[#0ea5e9]" />
            <span>As chamadas efetuadas por meio dos painéis utilizam protocolos TLSv1.3 criptografados nativamente.</span>
          </div>
          <span className="text-gray-500 text-right">v2.12.0 LTS</span>
        </div>
      </div>

      <AnimatePresence>
        {showWidgetModal && (
          <motion.div
            id="kn-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if ((e.target as HTMLElement).id === "kn-modal") setShowWidgetModal(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b1220] border border-gray-800 rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl space-y-4 max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-sky-400 animate-pulse" />
                  <h3 className="text-xs md:text-sm font-display font-medium text-white tracking-wide">Gerador de Chaves de API • KoreNexus</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href="https://k-flow-nexus.lovable.app/embed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 px-3 bg-sky-500/10 text-sky-450 font-semibold border border-sky-500/20 rounded-full text-[10px] hover:bg-sky-500/20 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Nova Aba</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    onClick={() => setShowWidgetModal(false)}
                    className="p-1.5 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white cursor-pointer"
                    title="Fechar modal"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Responsive Container embedding the KoreNexus widget */}
              <div className="w-full flex-1 min-h-[450px] md:min-h-[520px] rounded-2xl overflow-hidden bg-slate-950/40 relative border border-gray-850">
                <KoreNexusWidget />
              </div>

              <div className="text-[10px] font-mono text-gray-500 text-center pt-1 flex-shrink-0">
                Conectado de forma segura com o provedor de barramentos KoreNexus.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen overlay for KoreNexus API / Login Master wrapper */}
      <AnimatePresence>
        {isFullScreenOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="korenexus-fs"
            className="fixed inset-0 z-[2147483647] bg-[#0b1220] flex flex-col width-[100vw] height-[100vh]"
          >
            <div className="flex justify-between items-center px-4 py-2 bg-[#0b1220] border-b border-slate-850 flex-shrink-0">
              <span className="text-xs font-mono font-semibold text-slate-200">KoreNexus</span>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setIsFullScreenOverlay(false)}
                className="cursor-pointer width-[32px] height-[32px] rounded-lg border border-[#334155] bg-[#0f172a] text-white font-mono font-semibold text-xs transition duration-200 hover:bg-slate-800 flex items-center justify-center gap-1 px-3 py-1.5"
              >
                ✕ Fechar <span className="hidden sm:inline">[Esc]</span>
              </button>
            </div>
            <iframe
              src="https://k-flow-nexus.lovable.app/login"
              title="KoreNexus"
              allow="clipboard-write; clipboard-read; fullscreen"
              className="flex-1 w-full h-full border-0 bg-[#0b1220]"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
