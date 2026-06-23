import React, { useState, useEffect } from "react";
import { 
  Building2, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Lock, 
  BarChart3, 
  AlertTriangle,
  Send,
  RefreshCw,
  HelpCircle,
  PiggyBank,
  PhoneCall
} from "lucide-react";

export default function DiagnosticoPage() {
  const [step, setStep] = useState<"hero" | "quiz" | "calculating" | "gate" | "report">("hero");
  
  // Funnel Form Metrics State
  const [faturamento, setFaturamento] = useState<number>(150000); // 150k default
  const [tempoProcesso, setTempoProcesso] = useState<string>("mais_5"); // hours wasted per day
  const [sistemaEficacia, setSistemaEficacia] = useState<string>("planilhas_sistemas"); // level
  const [gargaloPrincipal, setGargaloPrincipal] = useState<string>("rejeicoes_sefaz"); // main issue
  const [volumeNfe, setVolumeNfe] = useState<string>("100_500");
  
  // Lead Details
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submittingLeads, setSubmittingLeads] = useState(false);

  // Generated Insights Calculation
  const [vazamentoMensal, setVazamentoMensal] = useState(0);
  const [tempoDesperdiçadoAnual, setTempoDesperdiçadoAnual] = useState(0);
  const [roiEstimado, setRoiEstimado] = useState(0);

  // Current sub-question index (0-3) inside "quiz" step
  const [quizIndex, setQuizIndex] = useState(0);

  // Compute stats based on inputs
  useEffect(() => {
    // Math for lead curiosity triggers
    let wasteMultiplier = 0.038; // 3.8% default revenue loss
    if (tempoProcesso === "mais_5") wasteMultiplier += 0.024;
    if (sistemaEficacia === "total_manual") wasteMultiplier += 0.032;
    if (gargaloPrincipal === "erro_humano") wasteMultiplier += 0.018;

    const monthlyLeak = faturamento * wasteMultiplier;
    
    let hoursPerYear = 120;
    if (tempoProcesso === "2_5") hoursPerYear = 480;
    if (tempoProcesso === "mais_5") hoursPerYear = 960;

    const estRoiVal = monthlyLeak * 12 * 0.78; // 78% of leakage solved

    setVazamentoMensal(parseFloat(monthlyLeak.toFixed(2)));
    setTempoDesperdiçadoAnual(hoursPerYear);
    setRoiEstimado(parseFloat(estRoiVal.toFixed(2)));
  }, [faturamento, tempoProcesso, sistemaEficacia, gargaloPrincipal, volumeNfe]);

  const handleStartQuiz = () => {
    setStep("quiz");
    setQuizIndex(0);
  };

  const handleNextQuiz = () => {
    if (quizIndex < 3) {
      setQuizIndex(quizIndex + 1);
    } else {
      setStep("calculating");
      // Simulate highly advanced calculation to trigger extreme curiosity & premium feel
      setTimeout(() => {
        setStep("gate");
      }, 2500);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone) return;

    setSubmittingLeads(true);
    // Simulate API registration
    setTimeout(() => {
      setSubmittingLeads(false);
      setStep("report");
    }, 1500);
  };

  // Quick formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans relative" id="diagnostico-funnel-root">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* STEP 1: HERO - THE CORE HOOK */}
      {step === "hero" && (
        <div className="space-y-8 animate-fade-in text-center py-8 px-4" id="funnel-hero-step">
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-gradient-to-r from-red-500/10 to-indigo-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold font-mono tracking-wider uppercase rounded-full inline-block">
              ⚠️ Auditoria Exclusiva para Empresários & Diretores
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight font-sans">
              Sua Empresa Está <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-indigo-400">Vazando até 38% de Caixa</span> em Rejeições e Horas Manuais?
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Descubra em segundos o gargalo invisível do seu ERP tradicional ou processosSEFAZ. Obtenha uma projeção autêntica e um roteiro imediato para estancar as perdas.
            </p>
          </div>

          {/* Social Proof Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 pb-2">
            {[
              { val: "R$ 142k/ano", label: "Média de vazamento evitado", color: "text-red-405 text-red-400" },
              { val: "940 horas", label: "Economizadas de digitação", color: "text-sky-400" },
              { val: "Zero-Glitch", label: "Protocolos Sefaz validados", color: "text-emerald-400" },
              { val: "2 minutos", label: "Sem custos ou compromisso", color: "text-indigo-400" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0b1220]/60 border border-gray-850 p-4 rounded-2xl flex flex-col items-center justify-center">
                <span className={`text-base sm:text-lg font-bold font-mono ${stat.color}`}>{stat.val}</span>
                <span className="text-[10px] text-gray-450 text-gray-400 text-center mt-1 leading-snug">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Main Visual Funnel Card */}
          <div className="bg-gradient-to-b from-[#11172a] to-[#070b14] border border-gray-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden max-w-3xl mx-auto shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl animate-pulse">
                <ShieldAlert className="h-8 w-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-sans max-w-lg">
                  "Quanto sua empresa deixa de ganhar hoje por não automatizar tarefas mecânicas?"
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  Utilizamos um algoritmo calibrado com base no faturamento de mais de 120 indústrias e comércios parceiros da região de Jundiaí e Grande São Paulo.
                </p>
              </div>

              <div className="pt-2 w-full max-w-sm">
                <button
                  onClick={handleStartQuiz}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-500 via-orange-500 to-indigo-650 hover:from-red-600 hover:to-indigo-750 text-white font-bold rounded-2xl text-xs sm:text-sm tracking-wide transition duration-200 shadow-xl shadow-red-500/10 flex items-center justify-center gap-2 select-none cursor-pointer active:scale-98"
                  id="btn-start-conversion"
                >
                  <span>Iniciar Diagnóstico de Lucratividade</span>
                  <ArrowRight className="h-4 w-4 text-white animate-bounce-horizontal" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-500 mt-3 font-mono">
                  <Lock className="h-3 w-3" />
                  <span>Seus dados de escaneamento seguem a LGPD e são protegidos.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: INTERACTIVE QUIZ CONVERSION STEPS */}
      {step === "quiz" && (
        <div className="bg-[#0b1220]/75 border border-gray-850 p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto shadow-2xl space-y-6 animate-fade-in" id="funnel-quiz-step">
          
          {/* QUESTION PANEL HEADER */}
          <div className="flex items-center justify-between border-b border-gray-850 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                AUDITORIA DE DESPERDÍCIO • ETAPA {quizIndex + 1} DE 4
              </span>
              <h3 className="text-sm font-bold text-white leading-none font-sans">Métricas do Negócio</h3>
            </div>
            
            {/* Simple Visual progress bar */}
            <div className="w-24 bg-slate-900 h-2.5 rounded-full border border-gray-850 overflow-hidden flex">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(quizIndex + 1) * 25}%` }}
              ></div>
            </div>
          </div>

          {/* QUIZ STEP index 0: Faturamento Mensal Slider */}
          {quizIndex === 0 && (
            <div className="space-y-5 py-2 font-sans">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Qual o faturamento mensal aproximado de sua operação comercial/industrial?</h4>
                <p className="text-xs text-gray-400">Essa métrica ajuda a calibrar a estimativa de perdas e retenções tributárias da Sefaz.</p>
              </div>

              <div className="bg-[#070b14] border border-gray-900 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center bg-slate-950/60 py-3 px-4 border border-gray-850 rounded-xl">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Estimativa Caixa</span>
                  <span className="text-base font-extrabold text-white font-mono">{formatCurrency(faturamento)}</span>
                </div>

                <div className="space-y-1 pt-2">
                  <input
                    type="range"
                    min="20000"
                    max="1000000"
                    step="20000"
                    value={faturamento}
                    onChange={(e) => setFaturamento(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                    <span>R$ 20.000,00</span>
                    <span>R$ 500.000,00</span>
                    <span>R$ 1.000.000,00 +</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ STEP index 1: Horas de processo manuais */}
          {quizIndex === 1 && (
            <div className="space-y-5 py-2 font-sans">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Quanto tempo útil sua equipe gasta por dia digitando notas, corrigindo rejeições ou consolidando arquivos XML?</h4>
                <p className="text-xs text-gray-400">Tempo mecânico é desperdício de energia produtiva qualificada.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "menos_2", title: "Menos de 2 horas diárias", desc: "A equipe tem processos semi-automáticos eficientes.", color: "hover:border-indigo-500/40" },
                  { id: "2_5", title: "Entre 2 a 5 horas diárias", desc: "Perguntas ou erros de digitação travam fluxos de expedição.", color: "hover:border-amber-500/40" },
                  { id: "mais_5", title: "Mais de 5 horas (Praticamente o dia todo)", desc: "Gargalo grave de digitação, conferência manual e planilhas paralelas.", color: "hover:border-red-500/40" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTempoProcesso(opt.id)}
                    className={`p-4 border rounded-2xl text-left block transition-all duration-200 cursor-pointer ${
                      tempoProcesso === opt.id 
                        ? "bg-indigo-600/10 border-indigo-500 text-white" 
                        : "bg-[#070b14] border-gray-900 text-gray-400 " + opt.color
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1 text-white">{opt.title}</span>
                    <span className="text-[10.5px] leading-relaxed block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUIZ STEP index 2: Sistemas vs Planilhas */}
          {quizIndex === 2 && (
            <div className="space-y-5 py-2 font-sans">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Como é feita a ponte de conciliação de dados entre seus faturamentos e o estoque?</h4>
                <p className="text-xs text-gray-400">Escolha o modelo que mais reflete seu dia a dia.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "total_manual", title: "Tudo manual e em Planilhas Excel", desc: "Temos planilhas para tudo e fazemos digitação dupla no emissor." },
                  { id: "planilhas_sistemas", title: "Sistemas básicos + Digitação síncrona", desc: "Temos um sistema, mas ele é lento e necessita de complementos." },
                  { id: "erp_desconectado", title: "ERP grande, mas sem conexão automática de APIs", desc: "As integrações falham com frequência e exigem arquivos manuais." }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSistemaEficacia(opt.id)}
                    className={`p-4 border rounded-2xl text-left block transition-all duration-200 cursor-pointer ${
                      sistemaEficacia === opt.id 
                        ? "bg-indigo-600/10 border-indigo-500 text-white" 
                        : "bg-[#070b14] border-gray-900 text-gray-400 hover:border-indigo-500/30"
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1 text-white">{opt.title}</span>
                    <span className="text-[10.5px] leading-relaxed block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUIZ STEP index 3: Gargalo do faturamento */}
          {quizIndex === 3 && (
            <div className="space-y-5 py-2 font-sans">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Qual dessas dores operacionais mais prejudica o seu crescimento atual?</h4>
                <p className="text-xs text-gray-400">Ao final do diagnóstico sugeriremos a arquitetura adequada KoreNexus.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "rejeicoes_sefaz", title: "Rejeições Sefaz & Erros Fiscais constantes", desc: "Cálculos e tags incorretas de impostos atrasam as entregas." },
                  { id: "erro_humano", title: "Preenchimento Manual lento de cadastros", desc: "Erros humanos que causam cancelamento ou devolução de faturas." },
                  { id: "estoque_divergencia", title: "Divergência Crítica entre physical vs fiscal", desc: "O estoque físico da minha indústria não bate com os relatórios." },
                  { id: "financeiro_lento", title: "Conciliação lenta de chaves Pix ou Boletos", desc: "Dificuldade de validar se cada Pix gerado foi compensado na hora." }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setGargaloPrincipal(opt.id)}
                    className={`p-4 border rounded-2xl text-left block transition-all duration-200 cursor-pointer ${
                      gargaloPrincipal === opt.id 
                        ? "bg-indigo-600/10 border-indigo-500 text-white" 
                        : "bg-[#070b14] border-gray-900 text-gray-400 hover:border-indigo-500/30"
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1 text-white">{opt.title}</span>
                    <span className="text-[10.5px] leading-relaxed block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BACK & FORWARD BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-850">
            <button
              onClick={() => {
                if (quizIndex > 0) setQuizIndex(quizIndex - 1);
                else setStep("hero");
              }}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition cursor-pointer"
            >
              Voltar
            </button>

            <button
              onClick={handleNextQuiz}
              className="py-2.5 px-6 bg-indigo-500 hover:bg-indigo-650 text-white font-bold rounded-xl text-xs transition duration-200 flex items-center gap-1.5 cursor-pointer selection-none"
            >
              <span>{quizIndex < 3 ? "Continuar" : "Computar Resultados"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COMPUTING ENGINE (REALISTIC LOADING PREPARATION PROCESSOR) */}
      {step === "calculating" && (
        <div className="bg-[#0b1220]/80 border border-gray-850 p-8 rounded-3xl max-w-md mx-auto text-center space-y-6 shadow-2xl py-12 animate-fade-in" id="funnel-calc-step">
          <div className="relative flex justify-center">
            <RefreshCw className="h-12 w-12 text-indigo-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-widest animate-pulse">Cálculo de Perdas Ativos...</h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              Cruzando tempo gasto diário com faturamento estimado nos barramentos fiscais...
            </p>
          </div>

          <div className="text-[10px] text-gray-500 font-mono space-y-1 max-w-xs mx-auto p-3 bg-slate-950/40 border border-gray-900 rounded-xl">
            <div className="flex justify-between">
              <span>[KoreAlgo] Estimando estragos...</span>
              <span className="text-emerald-400">OK</span>
            </div>
            <div className="flex justify-between">
              <span>[ROI] Calculando faturamento/mês...</span>
              <span className="text-emerald-400">92%</span>
            </div>
            <div className="flex justify-between">
              <span>[Sefaz] Indexando latência de XML...</span>
              <span className="text-indigo-400">Pronto</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: LEAD GATE - BLURRED PREVIEW WITH VALUE GATINGS */}
      {step === "gate" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto animate-fade-in" id="funnel-lead-step">
          
          {/* THE EYE-CATCHING SNEAK PEEK VIEW (BLURRED CURIOSITY TRIGGER) */}
          <div className="lg:col-span-5 bg-[#0b1220]/70 border border-gray-850 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl justify-center">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Relatório de Risco Gerado</span>
              </div>

              <div className="space-y-3 font-sans opacity-45 pointer-events-none filter blur-[2px]">
                <div className="bg-slate-900/60 p-4 border border-gray-900 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Est. Vazamento Anual</span>
                  <span className="text-xl font-mono font-bold text-red-400">R$ 138.420,00</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-gray-300">
                    <span>Atrasos Sefaz:</span>
                    <span className="font-mono text-white">41 Horas/Mês</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-300">
                    <span>Erros de Processamento:</span>
                    <span className="font-mono text-white">8,4%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border border-gray-900 rounded-xl text-center relative z-2">
              <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase block mb-1">DADOS PREOCUPANTES CALCULADOS</span>
              <p className="text-[10px] text-gray-400 leading-snug">
                Detectamos vazamentos síncronos graves em sua estrutura atual baseados em seu volume de faturamento de {formatCurrency(faturamento)}/mês.
              </p>
            </div>
          </div>

          {/* THE GATE FORM (UNLOCK IMMEDIATELY) */}
          <div className="lg:col-span-7 bg-[#0b1220] border border-gray-800 p-6 sm:p-8 rounded-3xl flex flex-col justify-center space-y-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold font-mono tracking-wider uppercase rounded">
                Acesso Liberado Grátis
              </span>
              <h3 className="text-lg font-display font-extrabold text-white">Liberar Roteiro de Solução & ROI Real</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Insira seus detalhes operacionais e receba instantaneamente na tela o PDF com o diagnóstico detalhado e as automações indicadas pela KoreNexus Engenharia.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-350 block">Nome do Gestor/Diretor</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-350 block">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="email@empresa.com.br"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-350 block">WhatsApp de Contato</label>
                  <input
                    type="text"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingLeads}
                  className="w-full py-3.5 px-4 bg-[#0ea5e9] hover:bg-[#0aa2e0] text-white font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-sky-500/15 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  id="btn-submit-lead"
                >
                  {submittingLeads ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Processando Diagnóstico...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Liberar Relatório Completo Grátis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL REPORT DASHBOARD - DEEP SCIENTIFIC REVELATION & CALL TO ACTION */}
      {step === "report" && (
        <div className="space-y-6 animate-fade-in" id="funnel-report-view">
          
          {/* Header Dashboard Banner */}
          <div className="p-6 bg-gradient-to-r from-[#140b0b] via-[#0b1220] to-[#080c16] border border-red-500/20 rounded-3xl relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-widest uppercase font-bold rounded-full">
                  Resultado Unlocked
                </span>
                <h3 className="text-xl font-display font-extrabold text-white text-sans">
                  Relatório de Eficiência ERP • {leadName}
                </h3>
                <p className="text-xs text-gray-400">
                  Preparamos seus dados de auditoria com base na latência e estimativas fornecidas no portal.
                </p>
              </div>

              <span className="px-2.5 py-1 bg-[#101422] border border-gray-850 rounded-xl text-[10px] font-mono text-gray-400 self-start md:self-auto uppercase">
                ID Auditoria: #KN-{Date.now().toString().slice(-6)}
              </span>
            </div>
          </div>

          {/* STATS ANALYTICS TILES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            {/* Box 1: Vazamento estimado */}
            <div className="bg-[#111622] border border-red-500/25 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:shadow-red-500/5 transition duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 w-fit">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Gargalo de Lucratividade Estimada</span>
                  <h4 className="text-2xl font-extrabold font-mono text-red-400 leading-none mt-1">
                    {formatCurrency(vazamentoMensal * 12)} <span className="text-xs text-gray-500 font-sans block mt-1">/ao ano desperdiçados</span>
                  </h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug mt-4 border-t border-gray-900 pt-3">
                Com base em um faturamento mensal de {formatCurrency(faturamento)}, erros operacionais e digitações comem margens silenciosamente.
              </p>
            </div>

            {/* Box 2: Tempo desperdiçado */}
            <div className="bg-[#111622] border border-amber-500/25 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:shadow-amber-500/5 transition duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 w-fit">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Capital Tempo Desperdiçado</span>
                  <h4 className="text-2xl font-extrabold font-mono text-amber-500 leading-none mt-1">
                    {tempoDesperdiçadoAnual} horas <span className="text-xs text-gray-500 font-sans block mt-1">/ano em digitação manual</span>
                  </h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug mt-4 border-t border-gray-900 pt-3">
                Este esforço repetitivo poderia estar direcionado a fechamento de vendas ou qualificação logística da empresa.
              </p>
            </div>

            {/* Box 3: ROI Recuperável */}
            <div className="bg-[#111622] border border-emerald-500/25 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:shadow-emerald-500/5 transition duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Viga de Retorno KoreNexus (ROI Est.)</span>
                  <h4 className="text-2xl font-extrabold font-mono text-emerald-400 leading-none mt-1">
                    {formatCurrency(roiEstimado)} <span className="text-xs text-gray-500 font-sans block mt-1">/ano de recuperação provável</span>
                  </h4>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug mt-4 border-t border-gray-900 pt-3">
                Implementando robôs virtuais auto-gerenciáveis estimamos recuperação de até 78% do gargalo operacional.
              </p>
            </div>

          </div>

          {/* PERSOANALIZED SOLUTION ARCHITECTURE */}
          <div className="bg-[#0b1220]/75 border border-gray-800 p-6 md:p-8 rounded-3xl relative overflow-hidden font-sans" id="funnel-solution-plan">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">PLANO DE OTIMIZAÇÃO INDICADO</span>
            <h3 className="text-lg font-bold text-white font-sans mb-5">Arquitetura Estruturada KoreNexus</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-850">
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg h-fit">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[12.5px] font-bold text-white">1. Automação de Fatura & Sefaz (Via Kflow)</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Elimine 100% da digitação de XMLs fiscais. O Kflow gera e valida a NF-e direto na Sefaz conectando sua indústria com o cliente final sem interferência manual.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg h-fit">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[12.5px] font-bold text-white">2. Integração Síncrona de Balanços</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Utilizando o canal Sheets Beta V1, sua contabilidade consolida as perdas e compensações de impostos automaticamente em formato de tabelas seguras.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg h-fit">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[12.5px] font-bold text-white">3. Notificações Dinâmicas de Erro</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Caso ocorra qualquer divergência ou mudança de tributação fiscal regional em Jundiaí/SP, sua equipe é alertada em tempo real no dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg h-fit">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[12.5px] font-bold text-white">4. API Hub para Barramentos</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Crie canais dedicados usando nosso Gerador QR Code para compensação Pix imediata integrada ao seu software fiscal.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* CALL TO ACTION BUTTON BAR */}
            <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white leading-none">Quer estancar esse vazamento de faturamento imediatamente?</h4>
                <p className="text-[11px] text-gray-400">
                  Agende uma reunião síncrona exclusiva de 15 minutos com um de nossos engenheiros da KoreNexus.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Olá KoreNexus! Realizei o Diagnóstico de Lucratividade para a minha empresa. \n\nNome: ${leadName}\nEmail: ${leadEmail}\nFaturamento Estimado: ${formatCurrency(faturamento)}/mês\nHoras perdidas/ano: ${tempoDesperdiçadoAnual} horas\n\nGostaria de estancar esse gargalo de faturamento com um Engenheiro.`);
                    window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${message}`, "_blank");
                  }}
                  className="px-6 py-3.5 bg-[#0ea5e9] hover:bg-[#0aa2e0] text-white font-bold rounded-xl text-xs transition duration-200 shadow-md shadow-sky-500/15 flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <PhoneCall className="h-4 w-4 text-white" />
                  <span>Solenizar Reunião com Engenharia</span>
                </button>
                
                <button
                  onClick={() => setStep("hero")}
                  className="py-3 px-4 bg-[#111622] hover:bg-slate-850 text-slate-300 border border-gray-800 hover:text-white rounded-xl text-[11px] transition cursor-pointer"
                >
                  Refazer Diagnóstico
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
