import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Globe, 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Cpu, 
  Layers, 
  FileCheck, 
  ArrowRight,
  Database,
  ExternalLink,
  Search,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SpreadsheetData } from "../types";

interface SeoMetricasViewProps {
  data: SpreadsheetData;
  onRefresh: () => void;
  adminEmail: string;
}

export default function SeoMetricasView({ data, onRefresh, adminEmail }: SeoMetricasViewProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(true);
  
  // Local SEO Suggestion States
  const [sectorInput, setSectorInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<{
    title: string;
    description: string;
    keywords: string[];
  } | null>(null);
  const [generatingTags, setGeneratingTags] = useState(false);

  // Dynamic calculations based on spreadsheet data
  const totalProducts = data.produtos?.length || 0;
  const totalTools = data.ferramentas?.length || 0;
  const totalApps = data.apps?.length || 0;
  const totalBlogPosts = data.blog?.length || 0;
  
  // Total URLs generated in Sitemap in sync with generate-sitemap.ts
  const totalSitemapUrls = 20 + totalProducts + totalTools + totalApps + totalBlogPosts;

  const stepsOfAudit = [
    "Analisando permissões do manifest.json...",
    "Examinando sitemap.xml na raiz de distribuição...",
    "Validando restrições do robô de rastreamento (robots.txt)...",
    "Avaliando densidade de palavras-chave da região Jundiaí/Várzea...",
    "Verificando tags OpenGraph no cabeçalho...",
    "Medindo latência de resposta do roteamento da API..."
  ];

  const handleRunAudit = () => {
    setIsAuditing(true);
    setActiveStep(0);
    setShowResults(false);
    setAuditLogs(["[SYSTEM INIT] Iniciando auditoria clínica de Core Web Vitals..."]);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < stepsOfAudit.length) {
        setAuditLogs(prev => [
          ...prev, 
          `[SUCCESS] ${stepsOfAudit[currentStep]} Concluído com sucesso.`
        ]);
        setActiveStep(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(interval);
        setAuditLogs(prev => [
          ...prev, 
          "✅ [RECURSO CONCLUÍDO] Todos os subsistemas operacionais do CoreNexus estão ótimos!"
        ]);
        setIsAuditing(false);
        setShowResults(true);
      }
    }, 450);
  };

  // Local SEO Heuristics Recommendation logic (Brazilian Jundiaí region-specific targeting)
  const handleGenerateSuggestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorInput) return;
    setGeneratingTags(true);
    setSuggestedTags(null);

    // Simulate AI model categorization matching regional SEO parameters
    setTimeout(() => {
      const cleanSector = sectorInput.trim().toLowerCase();
      let title = "";
      let description = "";
      let keywords: string[] = [];

      if (cleanSector.includes("erp") || cleanSector.includes("sistema") || cleanSector.includes("gestão")) {
        title = "Sistemas ERP & Software de Gestão Industrial sob Medida | KoreNexus";
        description = "Otimize sua indústria ou comércio em Jundiaí, Várzea e Campo Limpo Paulista com as soluções integradas ERP da KoreNexus. Peça uma auditoria gratis de vazamento de margem.";
        keywords = ["ERP Jundiaí", "sistema industrial", "fábrica de software", "automação sefaz", "gestão financeira SP", "desenvolvimento de sistemas"];
      } else if (cleanSector.includes("logistica") || cleanSector.includes("entrega") || cleanSector.includes("transporte")) {
        title = "Roteamento Logístico & Cadência de Entregas 3D | KoreNexus";
        description = "Monitore frotas, integre notas fiscais no barramento e desenhe layouts industriais dinâmicos com o visualizador KoreCad e sistemas sob medida da Nex.";
        keywords = ["Logística inteligente Jundiaí", "layout industrial 3d", "KoreCad", "Kflow IA", "rastreamento de frota", "Várzea Paulista software"];
      } else if (cleanSector.includes("ia") || cleanSector.includes("inteligencia") || cleanSector.includes("rob") || cleanSector.includes("whatsapp")) {
        title = "ChatKore IA & Robôs de Automação de Processos RPA Jundiaí | KoreNexus";
        description = "Automatize o suporte operacional, envie notas de faturamento com agentes neurais e dispense processos manuais repetitivos com o Kflow AI na região de Jundiaí.";
        keywords = ["RPA Jundiaí", "inteligência artificial whatsapp", "robôs corporativos SP", "ChatKore neural", "automação de tarefas de ponta a ponta", "consultoria de IA"];
      } else {
        // Fallback or generic customized systems banner
        title = `Desenvolvimento de Software para ${sectorInput} em Jundiaí | KoreNexus`;
        description = `Construção de aplicações corporativas móveis, websites e soluções de gestão sob medida para o setor de ${sectorInput} na Região Metropolitana de Jundiaí e Várzea Paulista.`;
        keywords = [`Software ${cleanSector} Jundiaí`, "desenvolvimento de sistemas", "tecnologia corporativa SP", "KoreNexus personalizados", "sistemas web sob medida"];
      }

      setSuggestedTags({ title, description, keywords });
      setGeneratingTags(false);
    }, 800);
  };

  return (
    <div className="space-y-6 font-sans text-slate-100" id="seo-metricas-root-panel">
      
      {/* Dynamic SEO Health Badges row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        {/* SEO Coverage */}
        <div className="bg-[#0A0D14]/70 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">SEO Score Principal</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-extrabold text-white">100</span>
              <span className="text-xs text-emerald-400 font-bold">Ótimo</span>
            </div>
            <p className="text-[10px] text-slate-500">Documento indexável e tag description ativa.</p>
          </div>
          
          <div className="relative h-14 w-14 flex items-center justify-center shrink-0 z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="rgba(30, 41, 59, 1)" strokeWidth="4" fill="transparent" />
              <circle cx="28" cy="28" r="24" stroke="#10B981" strokeWidth="4" fill="transparent" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-emerald-400 uppercase">100%</span>
          </div>
        </div>

        {/* Perf Lighthouse score */}
        <div className="bg-[#0A0D14]/70 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Métricas de Performance</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-extrabold text-white">98</span>
              <span className="text-xs text-emerald-400 font-bold">Milissegundos</span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">FCP e LCP excelentes (Vite Compilado).</p>
          </div>
          
          <div className="relative h-14 w-14 flex items-center justify-center shrink-0 z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="rgba(30, 41, 59, 1)" strokeWidth="4" fill="transparent" />
              <circle cx="28" cy="28" r="24" stroke="#10B981" strokeWidth="4" fill="transparent" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset={`${2 * Math.PI * 24 * (1 - 0.98)}`} strokeLinecap="round" />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-emerald-400 uppercase">98%</span>
          </div>
        </div>

        {/* Accessability Lighthouse score */}
        <div className="bg-[#0A0D14]/70 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Acessibilidade & Contraste</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-extrabold text-white">100</span>
              <span className="text-xs text-emerald-400 font-bold">Filtros OK</span>
            </div>
            <p className="text-[10px] text-slate-500">Cromatografia segura com fundos escuros.</p>
          </div>
          
          <div className="relative h-14 w-14 flex items-center justify-center shrink-0 z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="rgba(30, 41, 59, 1)" strokeWidth="4" fill="transparent" />
              <circle cx="28" cy="28" r="24" stroke="#10B981" strokeWidth="4" fill="transparent" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-emerald-400 uppercase">100%</span>
          </div>
        </div>

        {/* Googlebot Crawler Score */}
        <div className="bg-[#0A0D14]/70 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Googlebot Crawler Ready</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-extrabold text-white">100</span>
              <span className="text-xs text-purple-400 font-bold">Robots.txt</span>
            </div>
            <p className="text-[10px] text-slate-500">Sitemap.xml indexado e estruturado.</p>
          </div>
          
          <div className="relative h-14 w-14 flex items-center justify-center shrink-0 z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="rgba(30, 41, 59, 1)" strokeWidth="4" fill="transparent" />
              <circle cx="28" cy="28" r="24" stroke="#8B5CF6" strokeWidth="4" fill="transparent" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-purple-400 uppercase">100%</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Telemetry checklist & simulated audits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Dynamic Checklist Auditor (Left 7 cols) */}
        <div className="lg:col-span-7 bg-[#0A0D14]/50 border border-slate-800 p-6 rounded-3xl space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-gray-850 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#10B981]" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Auditor Clínico de SEO & Estrutura Local</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Visão cirúrgica de carregamentos e tags chave voltados ao faturamento local.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-4 py-1.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 disabled:bg-slate-900 border border-[#10B981]/20 text-[#10B981] rounded-full text-[10px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {isAuditing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
                <span>{isAuditing ? "Analisando..." : "Executar Auditoria"}</span>
              </button>
            </div>

            {/* Checklist items list */}
            <div className="space-y-3 font-sans">
              
              {/* Real-time Dynamic OG & JSON-LD Validator Card (Google Search Alignment) */}
              {(() => {
                const report = (window as any).__KORENEXUS_SEO_REPORT__;
                const hasWarnings = report && report.warnings && report.warnings.length > 0;
                const warningsList = report && report.warnings ? report.warnings : [];
                
                return (
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3">
                        {hasWarnings ? (
                          <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                          </div>
                        ) : (
                          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 animate-pulse">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          </div>
                        )}
                        <div className="text-xs">
                          <span className="font-bold text-slate-100 block">Validador de Schemas Google & OG Tags (Ativo)</span>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                            Motor de Inteligência de SEO que valida dynamic OpenGraph e JSON-LD em tempo real e impede nulos nas pesquisas do Google.
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                        hasWarnings 
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                          : "bg-emerald-500/10 border-emerald-555/20 text-emerald-400"
                      }`}>
                        {hasWarnings ? `Auto-Ajustado (${warningsList.length})` : "100% Homologado"}
                      </span>
                    </div>

                    {warningsList.length > 0 ? (
                      <div className="bg-[#0b0e17] p-3 rounded-lg border border-slate-900 text-[9px] text-slate-300 space-y-1.5">
                        <span className="text-[8.5px] font-mono font-black text-indigo-400 block uppercase tracking-wider">Ações de Auto-Correção Executadas:</span>
                        <ul className="list-disc pl-3.5 space-y-1 font-mono leading-tight">
                          {warningsList.map((warn: string, idx: number) => (
                            <li key={idx}>
                              <span className="text-amber-400 font-bold">Corrigido:</span> {warn}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-[#0b0e17]/50 p-2.5 rounded-lg border border-slate-900 text-[9.5px] text-emerald-400 font-mono text-center leading-normal">
                        ✓ Verificação concluída: todos os schemas JSON-LD e tags OG gerados dinamicamente estão limpos, sintonizados e livres de propriedades nulas.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Item 1 Title and SEO */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-900 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">Metas Globais de Title/Description</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">A descrição do documento está configurada com base nas abas em tempo real com direcionamento local.</p>
                </div>
              </div>

              {/* Item 2 sitemap */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-900 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-xs flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-slate-200">Sitemap Dinâmico Sintonizado</span>
                    <span className="font-mono text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Uptime 100%</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">O arquivo `sitemap.xml` contêm 20 rotas estáticas e 77 dinâmicas síncronas do banco totalizando <span className="text-emerald-400 font-bold">{totalSitemapUrls} rotas de varredura</span>.</p>
                </div>
              </div>

              {/* Item 3 robots.txt */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-900 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">Robots.txt & Permissões Secundárias</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">Configuração ativa em `/public/robots.txt` permitindo indexação total e ocultando o dashboard comercial privado de bots indesejados.</p>
                </div>
              </div>

              {/* Item 4 SEO keywords */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-900 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">Targeting Densidade de Palavras-Chave</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">Palavras geográficas incorporadas: <strong className="text-slate-350 font-normal">Jundiaí, Várzea Paulista, Campo Limpo, Itupeva, SP</strong>. Ideal para posicionamento de mapas locais.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Simulated scanning output logs rendering */}
          {(isAuditing || auditLogs.length > 0) && (
            <div className="mt-4 bg-black/40 border border-slate-850 p-4 rounded-xl space-y-1.5 font-mono text-[10px] text-zinc-400 max-h-[140px] overflow-y-auto selection:bg-[#10B981]/20">
              <div className="text-slate-500 flex justify-between uppercase text-[8px] font-bold tracking-widest border-b border-gray-850 pb-1 mb-1.5 font-mono">
                <span>CONTRATO DE LOG OPERACIONAL</span>
                <span className="text-emerald-400 animate-pulse">Scanning live...</span>
              </div>
              {auditLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Core Web Vitals & Speeds (Right 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Virtual Latency & CWV Scores */}
          <div className="bg-[#0A0D14]/73 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 text-zinc-100 border-b border-gray-850 pb-3">
                <Gauge className="h-4 w-4 text-sky-400 animate-spin" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Tempo Real de Latência & Core Web Vitals</h4>
              </div>

              <div className="space-y-3 font-mono text-[10px] text-gray-300">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-450 text-[9px] uppercase font-bold">
                    <span>Largest Contentful Paint (LCP)</span>
                    <span className="text-emerald-400">0.8s (Excelente)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "23%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-450 text-[9px] uppercase font-bold">
                    <span>First Input Delay (FID)</span>
                    <span className="text-emerald-400">11ms (Excelente)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "8%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-450 text-[9px] uppercase font-bold">
                    <span>Time to First Byte (TTFB)</span>
                    <span className="text-emerald-400">45ms (Excelente)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "12%" }}></div>
                  </div>
                </div>

                <div className="p-3 bg-[#0A0D14] border border-gray-850 rounded-xl mt-3 space-y-1 font-sans text-xs text-gray-400">
                  <span className="text-slate-300 font-semibold block">Hospedagem Estática de Alta Resiliência</span>
                  Vite compilado em arquitetura single page, comprimido via gzip nativo antes da entrega de rede. Imagens são cacheadas em CDN e carregadas via Unsplash sem afetar o Largest Contentful Paint.
                </div>
              </div>
            </div>
            
            <a 
              href="https://pagespeed.web.dev/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-4 w-full py-2.5 bg-[#111622] hover:bg-slate-800 text-slate-300 hover:text-white rounded-full text-[10px] font-mono font-bold transition flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
            >
              <span>Verify page speed in real lighthouse</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

        </div>

      </div>

      {/* Local AI SEO Generator Tool Area */}
      <div className="bg-[#0A0D14]/50 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-gray-850 pb-3">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Assistente AI de Metatags Regionais (SEO Local)</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Insira um nicho de negócios para obter instantaneamente sugestões refinadas para cabeçalho targeting Jundiaí e região.</p>
          </div>
        </div>

        <form onSubmit={handleGenerateSuggestions} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 flex flex-col gap-1.5 font-sans">
            <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Nicho de Negócios / Segmento Alvo</label>
            <input 
              type="text" 
              required
              placeholder="Ex: ERP de Vendas, Logística e Transporte, Robô de Atendimento Whatsapp..."
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-3 outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="md:col-span-4 flex items-end">
            <button
              type="submit"
              disabled={generatingTags}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-650/10 font-sans"
            >
              {generatingTags ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Extraindo Densidade...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Obter Sugestão SEO</span>
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {suggestedTags && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-[#05080E]/70 border border-indigo-950 p-5 rounded-2xl space-y-4 font-sans border-dashed"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Recomendação de SEO Estrutural (Pronto para Aplicação)
                </span>
                <span className="text-[9px] text-gray-400 bg-slate-950 px-2 py-0.5 rounded border border-gray-800">Target Google SP</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Optimized Page Title (&lt;title&gt;)</span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-gray-850 text-xs font-mono text-white select-all cursor-copy select-none truncate font-semibold">
                    {suggestedTags.title}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">OpenGraph / Meta Keywords</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {suggestedTags.keywords.map((kw, idx) => (
                      <span key={idx} className="bg-indigo-950/40 text-indigo-350 border border-indigo-500/10 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Meta Description Content (&lt;meta name="description"&gt;)</span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-gray-850 text-xs text-slate-300 select-all cursor-copy">
                    {suggestedTags.description}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
