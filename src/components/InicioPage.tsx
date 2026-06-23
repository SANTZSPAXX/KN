import React, { useState, useRef, useEffect } from "react";
import { getApiUrl, safeFetch } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layers, 
  Smartphone, 
  Cpu, 
  ChevronRight, 
  ChevronDown, 
  Download, 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  Activity, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Search, 
  Sliders, 
  ShieldCheck, 
  Check, 
  Loader2, 
  Building,
  AlertCircle,
  User,
  Briefcase,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Database,
  Lock,
  Settings,
  HelpCircle
} from "lucide-react";
import { jsPDF } from "jspdf";
import BrandingLogo from "./BrandingLogo";
import FaqSection from "./FaqSection";

interface InicioPageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function InicioPage({ activeTab, setActiveTab }: InicioPageProps) {
  // Collapsible Sections Toggles - Default closed to keep it clean and elegant
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // States for diagnostic tools
  const [leadGargalo, setLeadGargalo] = useState<string>("planilhas");
  const [leadTamanho, setLeadTamanho] = useState<string>("media");
  const [leadContatoPref, setLeadContatoPref] = useState<string>("presencial");

  // States for ROI simulator
  const [simSystemType, setSimSystemType] = useState<string>("erp");
  const [simInefficiency, setSimInefficiency] = useState<string>("media");
  const [simTeamSize, setSimTeamSize] = useState<number>(15);
  const [simActiveStep, setSimActiveStep] = useState<number>(0);

  // Client-attracting interactive conversion states
  const [comparisonTab, setComparisonTab] = useState<string>("faturamento");
  const [caseStudyTab, setCaseStudyTab] = useState<string>("industria");
  const [activeObjection, setActiveObjection] = useState<number>(0);
  const [compareTeamSize, setCompareTeamSize] = useState<number>(3); // 2, 4 or 8 devs comparison
  const [expandedSpecialty, setExpandedSpecialty] = useState<number | null>(null);
  const [activePilar, setActivePilar] = useState<number | null>(null);
  const [activePillarHero, setActivePillarHero] = useState<number | null>(null);

  // Action Plan AI Chat variables
  const [clientName, setClientName] = useState<string>("");
  const [clientIdea, setClientIdea] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [actionPlan, setActionPlan] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [chatFeedback, setChatFeedback] = useState<string>("");

  // Plan trigger text container scroll-to ref
  const planResultRef = useRef<HTMLDivElement>(null);

  // Scroll to output when plan is generated
  useEffect(() => {
    if (actionPlan && planResultRef.current) {
      planResultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [actionPlan]);

  // Handle AI Action Plan generation
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdea.trim()) {
      setChatFeedback("Por favor, descreva seus problemas corporativos ou ideias primeiro.");
      return;
    }

    setIsGenerating(true);
    setActionPlan("");
    setSendSuccess(false);
    setChatFeedback("");

    try {
      const response = await safeFetch("/api/plan-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "user", 
              content: `Olá! Sou o(a) ${clientName || "Cliente"} e quero um plano de ação para a seguinte situação: "${clientIdea}".` 
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Resposta inesperada do servidor");
      }

      const data = await response.json();
      if (data.reply) {
        setActionPlan(data.reply);
      } else {
        throw new Error("Nenhuma resposta recebida do motor");
      }
    } catch (err: any) {
      console.error(err);
      setChatFeedback("Ocorreu um erro ao entrar em contato com o motor neural ChatKore. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle sending action plan to owner (Yugny)
  const handleSendPlanToOwner = async () => {
    if (!actionPlan) return;
    setIsSending(true);
    setChatFeedback("");

    try {
      const response = await safeFetch("/api/send-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          clientIdea: clientIdea,
          planText: actionPlan
        })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      if (data.success) {
        setSendSuccess(true);
        setChatFeedback("Parabéns! Seus dados e o Plano de Ação foram encaminhados diretamente para o especialista Yugny (contato@korenexus.com.br) e estamos iniciando o seu contato via WhatsApp!");
        
        // Encode a concise and useful message for WhatsApp
        const waText = `Olá Yugny! Acabei de estruturar meu Plano de Ação na KoreNexus e enviá-lo para a Engenharia.\n\n📊 *DADOS DO LEAD:*\n• *Nome:* ${clientName || "Não informado"}\n• *E-mail:* ${clientEmail || "Não informado"}\n• *WhatsApp:* ${clientPhone || "Não informado"}\n\n💡 *IDEIA / PROBLEMA DO NEGÓCIO:*\n"${clientIdea || "Não informado"}"\n\n📌 *SOLICITAÇÃO:* Gostaria de debater as fases do plano, estimativas de prazos e validação técnica!`;
        window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(waText)}`, "_blank");
      }
    } catch (err) {
      setChatFeedback("Não foi possível transferir as coordenadas para o banco de dados. Acesse canais de contato manual.");
    } finally {
      setIsSending(false);
    }
  };

  // Generate and download a beautified PDF matching Swiss precision guidelines
  const handleDownloadPDF = () => {
    if (!actionPlan) return;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const purplePrimary = [124, 58, 237]; // #7C3AED
      const darkNavy = [11, 15, 26]; // #0B0F1A

      // Title header band
      doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.rect(0, 0, 210, 38, "F");

      // Custom Color Separator
      doc.setFillColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.rect(0, 38, 210, 2, "F");

      // Header Texts
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("KORENEXUS", 15, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(150, 150, 150);
      doc.text("SISTEMAS CORPORATIVOS EMBUTIDOS SOB MEDIDA", 15, 23);
      doc.text(`Doc Ref: KN-PLAN-${Date.now().toString().slice(-6)} • Gerado: ${new Date().toLocaleDateString("pt-BR")}`, 15, 29);

      // Metadata grey card
      doc.setFillColor(243, 244, 246);
      doc.rect(15, 46, 180, 30, "F");
      doc.setDrawColor(220, 224, 230);
      doc.rect(15, 46, 180, 30, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.text(`DIRETRIZ DE ARQUITETURA PERSONALIZADA`, 20, 52);

      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`Cliente Responsável: ${clientName || "Consultado pelo Painel"}`, 20, 58);
      
      const truncatedIdea = clientIdea.length > 72 ? clientIdea.slice(0, 72) + "..." : clientIdea;
      doc.text(`Bottleneck / Demanda: "${truncatedIdea}"`, 20, 64);
      doc.text(`Contato: ${clientEmail || "Não informado"} | ${clientPhone || "Sem telefone"}`, 20, 70);

      // Heading block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text("MAPA DE SOLUÇÃO E ENGENHARIA DE PROCESSO", 15, 87);

      doc.setDrawColor(230, 230, 230);
      doc.line(15, 91, 195, 91);

      // Clean Markdown markers for flat print presentation
      const cleanPlanText = actionPlan
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/###/g, "")
        .replace(/##/g, "");

      const textLines = doc.splitTextToSize(cleanPlanText, 180);
      
      let yPos = 98;
      const pageHeight = 297;
      const bottomSpacing = 22;

      for (let i = 0; i < textLines.length; i++) {
        if (yPos > pageHeight - bottomSpacing) {
          doc.addPage();
          
          // Custom header for sub-pages
          doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
          doc.rect(0, 0, 210, 14, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.text("KORENEXUS — Diretriz Tecnológica", 15, 9);
          
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          yPos = 24;
        }

        const line = textLines[i];
        const isHeader = line.match(/^\d\./) || line.startsWith("Resumo") || line.startsWith("Gargalos") || line.startsWith("Fases") || line.startsWith("Estimativa") || line.startsWith("Próximos");
        
        if (isHeader) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
          doc.setFontSize(11);
          doc.text(line, 15, yPos);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          yPos += 1;
        } else {
          doc.setFontSize(9.5);
          doc.text(line, 15, yPos);
        }
        yPos += 5.8;
      }

      // Border and Footer Page indicators
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(160, 160, 160);
      doc.text("KoreNexus • Soluções Robustas Sob Medida • contato@korenexus.com.br", 105, 287, { align: "center" });

      doc.save(`Plano_KoreNexus_Sprint_${(clientName || "Cliente").replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      setChatFeedback("Erro ao estruturar documento PDF.");
    }
  };

  return (
    <motion.div
      key="inicio"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-16 py-6"
    >
      {/* ================= PREMIUM VISITOR / CEO VIEW ================= */}
      <div className="space-y-16">
          {/* Hero split-layout containing text on left and 3D banner on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto text-left relative">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
            
            {/* Left Content Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                SaaS, WMS & Logística, Portaria Física e Segurança Cibernética
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Pare de perder margem: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Sistemas sob Medida, SaaS e WMS</span> que automatizam sua empresa de ponta a ponta.
              </h1>

              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                Fábrica de tecnologia sob medida para corporações na Grande Jundiaí. Especialistas em <strong>Portais SaaS</strong>, <strong>Controle de Portaria & Pátios</strong>, <strong>Estoque WMS</strong>, <strong>Sistemas de Imagem com OCR</strong> e <strong>Áreas de Segurança Máxima de Dados</strong>. Substitua sistemas lentos e planilhas por controle total 100% próprio.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="#chat-action-plan"
                  className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Criar Roteiro de Sistemas Sob Medida
                </a>
                
                <a
                  href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Poderíamos%20agendar%20um%20briefing%2520sobre%2520SaaS,%2520WMS,%2520Portaria%2520ou%252520Segurança%252520da%252520minha%252520empresa?"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-[#111622] hover:bg-[#161c2b] text-white border border-slate-850 hover:border-slate-700 font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
                >
                  Falar com Especialista
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right Interactive 3D Mockup Banner */}
            <div className="lg:col-span-5 h-full flex items-center justify-center relative">
              <div className="absolute w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="w-full relative rounded-3xl border border-slate-755 border-slate-700/55 p-3.5 bg-[#0f1422]/90 shadow-2xl overflow-hidden group"
              >
                {/* 3D Glass shine layer overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-white/0 to-white/5 rounded-full filter blur-xl pointer-events-none"></div>
                
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800">
                  <img
                    src="/src/assets/images/tech_banner_3d_1781541496009.jpg"
                    alt="Visão de Engenharia Digital 3D KoreNexus"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Holographic light reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1320] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                </div>

                <div className="pt-3 pb-1 px-1 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest block leading-none mb-1">PROJETO MODELO 3D</span>
                    <h4 className="text-xs font-bold text-white font-sans">Plataforma de Alta Performance</h4>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase font-black tracking-widest">
                    VITE + CLOUD
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* CORE PILLARS INTERACTIVE GRID & EXPANDABLE CARDS (0% IA Jargon, 100% Premium Corporate Capabilities) */}
          <div className="max-w-6xl mx-auto space-y-6 text-left pt-4">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block animate-pulse">SISTEMAS OPERACIONAIS SÊNIORES</span>
              <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Desenvolvimento de Sistemas sob Medida que Tracionam seu Negócio</h2>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                Confira nosso ecossistema de especialidades operacionais. Clique nas frentes abaixo para abrir o detalhamento completo de entrega técnica e conformidade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 0,
                  title: "📦 WMS & Logística Corporativa",
                  subtitle: "Controle de estoque, picking e faturamento ágil",
                  icon: <Activity className="h-4 w-4 text-emerald-400" />,
                  bullets: [
                    "Sincronização imediata de XML/DANFE com servidores da Sefaz.",
                    "Lançamento e controle de lotes industriais via QR Code e celular.",
                    "Logística reversa e relatórios estatísticos de prontidão (SLA)."
                  ],
                  benefit: "Substitui planilhas de estoque frágeis por controle automatizado e faturamento em menos de 2 segundos."
                },
                {
                  id: 1,
                  title: "🛡️ Portaria Integrante & Controle de Pátio",
                  subtitle: "Automação facial de pátios e cadastro de frotas",
                  icon: <Lock className="h-4 w-4 text-blue-400" />,
                  bullets: [
                    "Leitor óptico de caracteres de placas (OCR) para segurança extrema.",
                    "Sincronização de biometria facial com o controle de visitantes.",
                    "Eliminação de filas lentas por meio de cadastro prévio via link."
                  ],
                  benefit: "Acelera as vistorias de entrada e saída de caminhões aumentando a fluidez logística de pátios."
                },
                {
                  id: 2,
                  title: "👁️ Soluções de Imagem & Visão",
                  subtitle: "Auditoria visual, contagem por scanners e OCR",
                  icon: <Search className="h-4 w-4 text-purple-400" />,
                  bullets: [
                    "Scanners automáticos que digitalizam relatórios em lote sem digitação.",
                    "Processamento inteligente para validação física de embalagens e pacotes.",
                    "Verificação síncrona de assinaturas de canhotos fiscais e imagens."
                  ],
                  benefit: "Anula retrabalhos, erros de faturamento de boleto e duplicidade operacional de digitação manual."
                },
                {
                  id: 3,
                  title: "🌐 Plataformas SaaS sob Medida",
                  subtitle: "Portais web e aplicativos por assinatura centralizados",
                  icon: <Layers className="h-4 w-4 text-sky-400" />,
                  bullets: [
                    "Arquitetura moderna e leve, otimizada para dezenas de milhares de usuários.",
                    "Infraestrutura síncrona que não exige pagamento de mensalidades por login.",
                    "Ideal para portais de cooperativas, franqueados ou parceiros regionais."
                  ],
                  benefit: "Garante independência tecnológica total para você comercializar seu próprio software como serviço."
                },
                {
                  id: 4,
                  title: "📊 ERP Integrado e Faturamento",
                  subtitle: "Unificação de contas de filiais e operações financeiras",
                  icon: <Database className="h-4 w-4 text-amber-400" />,
                  bullets: [
                    "Sincronização síncrona de boletos bancários, caixas locais e despesas.",
                    "Módulo personalizado para controle de ordens de serviço (OS) em lote.",
                    "Sistemas rápidos que operam em conexões móveis lentas de colaboradores."
                  ],
                  benefit: "Tenha exatamente os módulos e parâmetros necessários para sua operação, sem complicação de softwares importados sêniors."
                },
                {
                  id: 5,
                  title: "🔒 Área de Segurança & Proteção de Dados",
                  subtitle: "Criptografia militar de dados contra vazamentos",
                  icon: <ShieldCheck className="h-4 w-4 text-indigo-400" />,
                  bullets: [
                    "Mascaramento e conformidade estrita com a LGPD federal brasileira.",
                    "Backups automáticos redundantes programados e firewalls de entrada.",
                    "Garantia de segurança mecânica de dados bancários de faturamento físico."
                  ],
                  benefit: "Blindagem jurídica de dados corporativos de motoristas, visitantes e faturamento tributário."
                }
              ].map((pillar) => {
                const isOpen = activePillarHero === pillar.id;
                return (
                  <div
                    key={pillar.id}
                    className={`bg-[#0b0e17] border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between ${
                      isOpen ? "border-indigo-500 bg-[#0d1222] shadow-lg shadow-indigo-950/25 ring-1 ring-indigo-500/20" : "border-slate-850 hover:border-slate-750"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                          {pillar.icon}
                        </div>
                        <button
                          onClick={() => setActivePillarHero(isOpen ? null : pillar.id)}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-indigo-450 rounded-lg transition-colors cursor-pointer font-bold"
                        >
                          {isOpen ? "Ocultar ▲" : "Detalhar Solução ▼"}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-white font-sans transition-colors group-hover:text-indigo-400">{pillar.title}</h3>
                        <p className="text-[10px] text-slate-500 font-sans leading-relaxed">{pillar.subtitle}</p>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="pt-3 border-t border-slate-850 space-y-3"
                          >
                            <ul className="space-y-1.5 text-[10.5px] text-slate-305 text-slate-400 font-sans leading-relaxed">
                              {pillar.bullets.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-indigo-400 font-bold mt-0.5 shrink-0">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="p-3 bg-indigo-950/20 border border-indigo-900/15 rounded-xl text-[10px] text-indigo-300 font-sans leading-relaxed">
                              <strong>Diferencial de Retorno:</strong> {pillar.benefit}
                            </div>

                            <button
                              onClick={() => {
                                const msg = `Olá! Estive analisando o diferencial de "${pillar.title}" no ecossistema da KoreNexus. Gostaria de entender mais e agendar um alinhamento comercial rápido de viabilidade financeira.`;
                                window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
                              }}
                              className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors w-full flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Garantir esta Solução para Minha Empresa</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blueprints Section to Pre-populate Form */}
          <div className="max-w-4xl mx-auto space-y-6 text-left">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block animate-pulse">ACELERE SEU BRIEFING</span>
              <h2 className="text-lg md:text-2xl font-extrabold text-white tracking-tight">Sistemas sob Medida & Blueprints Prontos para sua Empresa</h2>
              <p className="text-[11px] text-slate-400 leading-normal max-w-2xl mx-auto">Selecione um dos nossos escopos pré-arquitetados abaixo para auto-preencher o gerador de Planos de Ação instantaneamente e ver o resultado de alto nível.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "⚡ RPA Fiscal & Faturamento",
                  desc: "Automação síncrona que lê dados ou consulta tabelas e faz emissão e autorização de notas fiscais (XML/DANFE) em lote na Sefaz.",
                  idea: "Preciso de um sistema automatizado para ler dados ou consultar bancos de dados legados e disparar autorizações de notas fiscais (XML/DANFE) em lote diretamente na Sefaz municipal de forma rápida e segura, eliminando digitação manual."
                },
                {
                  title: "📱 App de Campo Offline",
                  desc: "Formulários e registros de vendas de campo, rotas de transporte e vistorias offline com sincronização segura ao reestabelecer conexão.",
                  idea: "Desejo criar um aplicativo de campo para nossa equipe comercial ou motoristas registrarem vendas, visitas e faturamentos de cargas totalmente offline, com sincronização síncrona inteligente em lote automática ao recuperar internet."
                },
                {
                  title: "📊 Console Geral Bento",
                  desc: "Unificação de contas de filiais, relatórios em tempo real, boletos emitidos e caixas locais em painéis Bento de alta performance.",
                  idea: "Desejo unificar entradas financeiras, faturamentos, boletos bancários emitidos e custos de logística das filiais em uma única dashboard Bento de painéis analíticos atualizada em tempo real."
                }
              ].map((bp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setClientIdea(bp.idea);
                    const elem = document.getElementById("chat-action-plan");
                    if (elem) {
                      elem.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  className="p-5 bg-[#0b0e17] hover:bg-[#111622] rounded-2xl border border-slate-850 hover:border-indigo-500/50 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group hover:shadow-lg hover:shadow-indigo-550/5"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-indigo-400 font-bold block uppercase">PROJETO MODELO</span>
                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors font-sans">{bp.title}</h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{bp.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Usar este blueprint
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

      {/* 2. Interactive AI Action Plan Creator (Central request) */}
      <section id="chat-action-plan" className="max-w-4xl mx-auto bg-gradient-to-b from-[#111422]/90 to-[#0A0D18]/95 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Cpu className="h-32 w-32 text-indigo-400" />
        </div>

        <div className="text-left max-w-2xl space-y-2 relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-400/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest font-bold">SIMULADOR ENGENHARIA KORENEXUS</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
            Monte seu Plano de Ação em Segundos
          </h2>
          <p className="text-xs text-slate-400 leading-normal">
            Adicione as ideias do seu novo software, os maiores problemas da sua empresa ou gargalos operacionais e nossos algoritmos de engenharia construirão um roteiro de desenvolvimento sênior, com arquitetura ideal de nuvem, banco de dados e estimativa de resultados.
          </p>
        </div>

        <form onSubmit={handleGeneratePlan} className="space-y-4 pt-1 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-black">Seu Nome / Empresa</label>
              <input 
                type="text" 
                placeholder="Ex: João da Distribuidora"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full bg-[#0a0d15] border border-slate-800 focus:border-indigo-500 hover:border-slate-700 text-xs text-white p-3.5 rounded-xl outline-none transition-all placeholder-slate-650"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-black">Seu E-mail</label>
              <input 
                type="email" 
                placeholder="Ex: joao@distribuidora.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="w-full bg-[#0a0d15] border border-slate-800 focus:border-indigo-500 hover:border-slate-700 text-xs text-white p-3.5 rounded-xl outline-none transition-all placeholder-slate-650"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-black">WhatsApp para Contato</label>
              <input 
                type="tel" 
                placeholder="Ex: (11) 99999-9999"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
                className="w-full bg-[#0a0d15] border border-slate-800 focus:border-indigo-500 hover:border-slate-700 text-xs text-white p-3.5 rounded-xl outline-none transition-all placeholder-slate-650"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-slate-400 font-black">Adicione suas Ideias ou Problemas do seu Negócio</label>
            <textarea 
              rows={4}
              placeholder="Descreva aqui o que quer resolver ou desenvolver. Ex: 'Tenho uma transportadora em Jundiaí e gastamos muito tempo digitando dados de notas em planilhas do Excel manually para faturar, o que causa muitos erros de emissão.'"
              value={clientIdea}
              onChange={(e) => setClientIdea(e.target.value)}
              required
              className="w-full bg-[#0a0d15] border border-slate-800 focus:border-indigo-500 hover:border-slate-700 text-xs text-white p-4 rounded-xl outline-none transition-all resize-none placeholder-slate-650 leading-relaxed font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-950/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Estruturando Roteiro e Plano de Ação...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Plano de Ação Digital Customizado
              </>
            )}
          </button>
        </form>

        {chatFeedback && !actionPlan && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/15 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{chatFeedback}</span>
          </div>
        )}

        {/* Action Plan Results Display Area */}
        <AnimatePresence>
          {actionPlan && (
            <motion.div 
              ref={planResultRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-6 border-t border-slate-850 space-y-5 text-left"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-950/20 p-4 border border-indigo-900/30 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">PRONTO COM SUCESSO!</span>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Diretriz & Plano Tecnológico KoreNexus
                  </h3>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-[#7C3AED] to-indigo-600 hover:from-purple-700 hover:to-indigo-750 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Baixar PDF Bonito
                  </button>

                  <button
                    onClick={handleSendPlanToOwner}
                    disabled={isSending || sendSuccess}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-emerald-450 border border-slate-800 disabled:opacity-75 disabled:text-gray-500 leading-none text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : sendSuccess ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>{sendSuccess ? "Enviado à KoreNexus" : "Enviar p/ Engenharia"}</span>
                  </button>
                </div>
              </div>

              {chatFeedback && sendSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{chatFeedback}</span>
                </div>
              )}

              <div className="p-6 bg-[#07090f] border border-slate-900 rounded-2xl space-y-4">
                <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 font-sans space-y-4 whitespace-pre-wrap">
                  {actionPlan}
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-850/60 flex items-center gap-2.5 justify-center text-center">
                <Building className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-450 uppercase">Atendimento regional local: Jundiaí, Itupeva, Várzea e arredores</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. COLLAPSIBLE COMPONENT: "Onde sua Empresa está Perdendo Dinheiro?" */}
      <section className="bg-[#0b0e17]/80 rounded-3xl border border-slate-850 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full p-6 flex items-center justify-between text-left cursor-pointer select-none focus:outline-none hover:bg-slate-950/20 transition-all duration-300"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">DIAGNÓSTICO REGIONAL INTERATIVO</span>
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Onde sua Empresa está Perdendo Dinheiro?</span>
            </h2>
            <p className="text-xs text-slate-450 font-normal">
              {showDiagnostics ? "Clique para fechar o diagnóstico de processos." : "Clique para abrir e testar os gargalos operacionais da sua equipe."}
            </p>
          </div>
          <div className={`p-2.5 bg-slate-900 border border-slate-800 rounded-xl transition-all duration-350 ${showDiagnostics ? "rotate-180 border-indigo-500" : ""}`}>
            <ChevronDown className="h-4 w-4 text-slate-450" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {showDiagnostics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 md:p-8 pt-2 md:pt-4 border-t border-slate-900 bg-[#080b13]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                
                {/* Questions on left (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Q1: Gargalo */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">1. Qual o maior obstáculo técnico ou operacional hoje?</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: "planilhas", label: "Planilhas de Excel Lentas", desc: "Processos manuais excessivos e duplicados" },
                        { id: "legado", label: "Sistemas Antigos & Travas", desc: "Sistemas legados lentos e com quedas frequentes" },
                        { id: "sefaz", label: "Emissão de Nota / APIs Manual", desc: "Falta de automação de faturamento ou Sefaz" },
                        { id: "relatorios", label: "Visibilidade Fraca de Caixa", desc: "Dificuldade para gerar relatórios operacionais" }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setLeadGargalo(item.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                            leadGargalo === item.id 
                              ? "bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-500/5" 
                              : "bg-[#090d16] border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[9.5px] text-slate-500 mt-0.5 block leading-normal">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2: Team size */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">2. Quantos profissionais sofrem com esse problema hoje?</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: "pequeno", label: "Pequeno Time", desc: "Até 10 pessoas" },
                        { id: "media", label: "Time Médio", desc: "11 a 50 pessoas" },
                        { id: "corporativo", label: "Corporativo", desc: "Mais de 50 pessoas" }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setLeadTamanho(item.id)}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                            leadTamanho === item.id 
                              ? "bg-blue-600/10 border-blue-500 text-white shadow-md shadow-blue-500/5" 
                              : "bg-[#090d16] border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5 block">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3: Contact Type Preference */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">3. Qual canal prefere para o Diagnóstico Gratuito?</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: "presencial", label: "Presencial SP", desc: "Faremos uma visita" },
                        { id: "online", label: "Call Rápida (15m)", desc: "Vídeo-chamada ágil" },
                        { id: "pdf", label: "Relatório Relâmpago", desc: "Layout & Viabilidade" }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setLeadContatoPref(item.id)}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                            leadContatoPref === item.id 
                              ? "bg-emerald-600/10 border-emerald-500 text-white shadow-md shadow-emerald-500/5" 
                              : "bg-[#090d16] border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5 block">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Regional Urgency banner */}
                  <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl flex items-start gap-3">
                    <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                      <Activity className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-left">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block mb-0.5">ESTRUTURA LOCAL DE PROXIMIDADE</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        Atendemos presencialmente indústrias em <strong className="text-slate-200">Jundiaí, Várzea Paulista, Campo Limpo Paulista, Itupeva e região</strong>. Entregamos mapeamento in-loco sintonizado para acelerar seus ERPs e notas fiscais.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results formulation on right */}
                <div className="lg:col-span-5 bg-[#0b0e17] border border-slate-900 p-6 rounded-2xl space-y-5 text-left h-full flex flex-col justify-between shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                      <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">DIRETRIZ DE ARQUITETURA</h4>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/15 text-[8.5px] font-mono font-bold text-indigo-400 rounded">
                        PLANO TÉCNICO
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Diagnóstico de Gargalo:</span>
                        <p className="text-xs font-semibold text-white">
                          {leadGargalo === "planilhas" && "❌ Sobrecarga operacional por uso excessivo de planilhas dispersas"}
                          {leadGargalo === "legado" && "❌ Quedas de performance e falha crítica em sistemas legados lentos"}
                          {leadGargalo === "sefaz" && "❌ Lentidão em emissões XML de Notas Fiscais e Sefaz Manual"}
                          {leadGargalo === "relatorios" && "❌ Ponto cego de fluxo de caixa e relatórios dispersos"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9.5px] text-slate-500 uppercase font-mono block">Estratégia Recomendada KoreNexus:</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans bg-[#07090f] p-3 border border-slate-950 rounded-xl">
                          {leadGargalo === "planilhas" && "Iremos estruturar um ERP customizado central e leve (PostgreSQL hospedado em nuvem) convertendo suas principais tabelas em um banco de dados integrado de acesso imediato, anulando erros de digitação e duplicidade de dados."}
                          {leadGargalo === "legado" && "Modernização de barramentos de microsserviços. Isolar as operações legadas atrás de rotas seguras com cache escalonável de cache em memória e banco de dados moderno sob medida, garantindo SLA estável."}
                          {leadGargalo === "sefaz" && "Instanciação de um bot inteligente (RPA) integrado diretamente ao nosso validador estrutural e Sefaz do Brasil, automatizando a aprovação, guarda e recuperação de XMLs fiscais em lote."}
                          {leadGargalo === "relatorios" && "Engrenagem de painéis analíticos bento unificados no seu próprio celular ou navegador em tempo real, conectando entradas manuais, boletos e gateways sob criptografia de ponta."}
                        </p>
                      </div>

                      <div className="space-y-2.5 border-t border-slate-900 pt-3">
                        <div className="flex justify-between items-center text-[10.5px] font-sans">
                          <span className="text-slate-500">Estimativa de Economia de Tempo:</span>
                          <strong className="text-emerald-400">
                            {leadTamanho === "pequeno" ? "~20 Horas/Mês" : leadTamanho === "media" ? "~65 Horas/Mês" : "~140+ Horas/Mês"}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px] font-sans">
                          <span className="text-slate-500">Canal de Encontro Preferido:</span>
                          <strong className="text-indigo-400 uppercase font-mono">
                            {leadContatoPref === "presencial" ? "Presencial em sua Sede SP" : leadContatoPref === "online" ? "Vídeo-Chamada Online" : "Relatório Executivo PDF"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      const gargaloLabel = 
                        leadGargalo === "planilhas" ? "Planilhas de Excel Lentas" :
                        leadGargalo === "legado" ? "Sistemas Antigos & Travas" :
                        leadGargalo === "sefaz" ? "Emissão de Nota / APIs Manual" : 
                        "Visibilidade Fraca de Caixa";

                      const tamanhoLabel = 
                        leadTamanho === "pequeno" ? "Até 10 pessoas" :
                        leadTamanho === "media" ? "11 a 50 pessoas" :
                        "Mais de 50 pessoas";

                      const canalLabel = 
                        leadContatoPref === "presencial" ? "Visita Presencial em minha sede (Jundiaí / Várzea / Região)" :
                        leadContatoPref === "online" ? "Vídeo-chamada Online (15 min)" :
                        "Relatório Executivo em PDF por WhatsApp";

                      const msg = `Olá! Realizei o Diagnóstico de Processo no site da KoreNexus.\n\n*Gargalo Operacional:* ${gargaloLabel}\n*Tamanho da Equipe afetada:* ${tamanhoLabel}\n*Canal Preferencial:* ${canalLabel}\n\nGostaria de agendar de forma prioritária o meu atendimento gratuito!`;
                      window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <span>Concluir Diagnóstico e Agendar no WhatsApp</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. COLLAPSIBLE COMPONENT: ROI & Budget Viability Simulator */}
      <section className="bg-[#0b0e17]/80 rounded-3xl border border-slate-850 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="w-full p-6 flex items-center justify-between text-left cursor-pointer select-none focus:outline-none hover:bg-slate-950/20 transition-all duration-300"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">SIMULADOR OPERACIONAL</span>
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Simulador Operacional de Retorno</span>
            </h2>
            <p className="text-xs text-slate-450 font-normal">
              {showSimulator ? "Clique para fechar o simulador técnico." : "Clique para simular custos, prazos de entrega e economia estimada do seu novo sistema."}
            </p>
          </div>
          <div className={`p-2.5 bg-slate-900 border border-slate-800 rounded-xl transition-all duration-350 ${showSimulator ? "rotate-180 border-emerald-500" : ""}`}>
            <ChevronDown className="h-4 w-4 text-slate-450" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {showSimulator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 md:p-8 pt-2 md:pt-4 border-t border-slate-900 bg-[#080b13]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                
                {/* Controls */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Step 1: Type selection */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">1. Escopo de Desenvolvimento principal</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "erp", label: "ERP Corporativo / Painéis", icon: <Layers className="h-4 w-4" /> },
                        { id: "app", label: "Aplicativo Mobile Offline", icon: <Smartphone className="h-4 w-4" /> },
                        { id: "api", label: "APIs / Integração de Fluxos", icon: <Cpu className="h-4 w-4" /> }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSimSystemType(opt.id)}
                          className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between h-24 cursor-pointer ${
                            simSystemType === opt.id 
                              ? "bg-indigo-600/10 border-indigo-500 text-white shadow-lg" 
                              : "bg-[#0c101a] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg w-fit ${simSystemType === opt.id ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800/50 text-slate-500"}`}>
                            {opt.icon}
                          </div>
                          <span className="text-xs font-bold leading-tight mt-2">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Inefficiency context */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">2. Complexidade / Gargalo nos Processos Atuais</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "baixa", label: "Baixo", desc: "Processo manual simples", color: "hover:border-blue-500/30" },
                        { id: "media", label: "Médio", desc: "Planilhas confusas", color: "hover:border-indigo-500/30" },
                        { id: "critica", label: "Crítico", desc: "Erros de faturamento e perdas", color: "hover:border-rose-500/30" }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSimInefficiency(opt.id)}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                            simInefficiency === opt.id 
                              ? "bg-gradient-to-b from-[#18132b] to-[#120e24] border-indigo-400 text-white" 
                              : `bg-[#0c101a] border-slate-800 text-slate-400 ${opt.color}`
                          }`}
                        >
                          <span className="text-xs font-bold block">{opt.label}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5 block truncate">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Team size range */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">3. Número de Colaboradores Afetados</span>
                      <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 font-mono text-xs rounded-md font-bold">{simTeamSize} usuários</span>
                    </div>
                    <input 
                      type="range" 
                      min="3" 
                      max="150" 
                      value={simTeamSize} 
                      onChange={(e) => setSimTeamSize(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>3 Mínimo</span>
                      <span>75 Médio Enterprise</span>
                      <span>150+ Máximo</span>
                    </div>
                  </div>
                </div>

                {/* Results Display */}
                <div className="lg:col-span-5 bg-[#0e1320] border border-slate-850 p-6 rounded-2xl space-y-6 text-left shadow-lg">
                  <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">PREVISÃO ESTIMADA DE RETORNO</h4>
                  
                  {(() => {
                    let baseTimeWeeks = 4;
                    let softwareCostSavingMultiplier = 1200;
                    let productivityMultiplierPercent = 15;

                    if (simSystemType === "erp") {
                      baseTimeWeeks = 6;
                      softwareCostSavingMultiplier = 3800;
                      productivityMultiplierPercent = 35;
                    } else if (simSystemType === "app") {
                      baseTimeWeeks = 8;
                      softwareCostSavingMultiplier = 4500;
                      productivityMultiplierPercent = 40;
                    } else {
                      baseTimeWeeks = 4;
                      softwareCostSavingMultiplier = 1900;
                      productivityMultiplierPercent = 25;
                    }

                    if (simInefficiency === "media") {
                      baseTimeWeeks += 1;
                      productivityMultiplierPercent += 10;
                    } else if (simInefficiency === "critica") {
                      baseTimeWeeks += 2;
                      productivityMultiplierPercent += 25;
                    }

                    const yearlySavings = Math.round(softwareCostSavingMultiplier * simTeamSize * 1.25);
                    const hoursSavedMonthly = Math.round(simTeamSize * 22 * (productivityMultiplierPercent / 100));

                    return (
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-mono">Prazo Estimado de Construção</span>
                          <div className="flex items-baseline gap-1.5 text-2xl font-extrabold text-white">
                            <span>{baseTimeWeeks} a {baseTimeWeeks + 2}</span>
                            <span className="text-xs font-normal text-slate-400 font-sans">semanas úteis</span>
                          </div>
                        </div>

                        <div className="space-y-1 border-t border-slate-850 pt-4">
                          <span className="text-[10px] text-slate-500 uppercase font-mono">Economia Estimada por Ano</span>
                          <div className="flex items-baseline gap-1.5 text-3xl font-black text-emerald-450">
                            <span className="text-xs font-bold leading-none">R$</span>
                            <span>{yearlySavings.toLocaleString("pt-BR")}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-tight pt-1">Sem mensalidades engessadas ou bloqueio de usuários.</span>
                        </div>

                        <div className="space-y-1 border-t border-slate-850 pt-4 pb-2">
                          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Produtividade Gerada do Time</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">+{productivityMultiplierPercent}%</span>
                            <div className="h-2 bg-slate-800 rounded-full flex-1 overflow-hidden">
                              <div 
                                className="bg-indigo-505 bg-indigo-500 h-full transition-all duration-500" 
                                style={{ width: `${Math.min(productivityMultiplierPercent * 1.5, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">Estimativa de <strong>{hoursSavedMonthly} horas operacionais poupadas</strong> mensais.</span>
                        </div>

                        <button 
                          onClick={() => {
                            const details = `Olá, vim do Simulador da Home da KoreNexus. Selecionei: ${simSystemType === 'erp' ? 'ERP/Painéis' : simSystemType === 'app' ? 'App Mobile' : 'APIs/Integração'}, com complexidade ${simInefficiency} e equipe de ${simTeamSize} pessoas. Gostaria de receber um escopo.`;
                            window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(details)}`, "_blank");
                          }}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-650 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Apresentar Projeto no WhatsApp</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SEÇÃO ALTAMENTE CONVERSIVA: ANTES VS DEPOIS COM KORENEXUS */}
      <section className="bg-gradient-to-b from-[#090d16] to-[#05080f] rounded-3xl border border-slate-850 p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-505 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">COMPARAÇÃO PRÁTICA</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Automação Industrial e de Processos: Como Transformamos seu Negócio</h2>
          <p className="text-xs text-slate-400">Clique nas abas e veja a diferença prática entre os problemas comuns de TI e o padrão de Engenharia KoreNexus.</p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {[
            { id: "faturamento", label: "Faturamento & Notas" },
            { id: "mensalidades", label: "Custos & Propriedade" },
            { id: "suporte", label: "Suporte & SLAs" },
            { id: "flexibilidade", label: "Mobilidade & Offline" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setComparisonTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold font-sans rounded-xl transition-all cursor-pointer ${
                comparisonTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card Antes (Vermelho/Cinza) */}
          <div className="p-6 bg-[#0E0F16] border border-rose-500/10 rounded-2xl flex flex-col justify-between space-y-4 shadow-inner relative overflow-hidden">
            <div className="absolute -top-1 -right-1 bg-red-500/10 border-b border-l border-red-500/20 px-3 py-1 rounded-bl-xl text-[9px] font-mono font-black text-red-400 uppercase tracking-widest">
              CENÁRIO COMUM / ENGESSADO
            </div>
            <div className="space-y-3">
              <span className="text-red-400 font-bold text-base block">⚠️ O problema do mercado tradicional:</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {comparisonTab === "faturamento" && "Colaboradores digitando dados fiscais manualmente por até 5 horas diárias do Excel para o Sefaz. Riscos frequentes de multas por preenchimento incorreto de alíquotas fiscais e atrasos críticos de entregas."}
                {comparisonTab === "mensalidades" && "A sua empresa paga aluguéis mensais absurdos de software (vendor lock-in) que aumentam a cada novo usuário cadastrado. Se parar de pagar, perde o acesso imediato ao seu próprio banco de dados corporativo histórico."}
                {comparisonTab === "suporte" && "Quando ocorre uma parada de emissão ou queda de servidor, sua equipe abre chamados em um chat de suporte terceirizado e espera até 3 dias úteis para receber uma resposta de um robo automatizado ineficaz."}
                {comparisonTab === "flexibilidade" && "Aplicativos de campo que travam assim que o sinal de internet cai no cliente final ou na área rural de distribuição. O vendedor perde a venda ou precisa preencher cartões de papel."}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-900/40 text-[10.5px] text-rose-300/80 font-mono italic flex items-center gap-1.5 leading-none">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Gera desperdício de tempo e prejuízos invisíveis semanais.</span>
            </div>
          </div>

          {/* Card Depois (Verde/Azul) */}
          <div className="p-6 bg-gradient-to-br from-[#0c1622] to-[#0a101b] border border-emerald-500/25 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute -top-1 -right-1 bg-emerald-500/15 border-b border-l border-emerald-500/30 px-3 py-1 rounded-bl-xl text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest animate-pulse">
              PADRÃO ENGENHARIA KORENEXUS
            </div>
            <div className="space-y-3">
              <span className="text-emerald-400 font-bold text-sm block">✨ O padrão de aceleração executiva:</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {comparisonTab === "faturamento" && "Faturamento estruturado inteligente e robotizado (RPA) em lote. O sistema valida automaticamente regras de ICMS/fisco em microssegundos e dispara notas fiscais em lote com 1 único clique."}
                {comparisonTab === "mensalidades" && "Sem mensalidade abusiva de licença. Todo o código-fonte proprietário pertence 100% legalmente à sua empresa. A estrutura de dados e arquivos roda na sua própria nuvem, gerando independência total de fornecedor."}
                {comparisonTab === "suporte" && "Suporte de proximidade física de nível militar. SLAs de tempo real de 15 minutos em Jundiaí e região. Visitas locais presenciais de engenheiros de software seniores para homologar sua equipe."}
                {comparisonTab === "flexibilidade" && "Apps robustos offline nativos. Os colaboradores lançam pedidos e movimentações fiscais sem uma gota de internet. A sincronização em lote ocorre em segundo plano de forma síncrona instantaneamente e automática ao recuperar o sinal."}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-900/40 text-[10.5px] text-emerald-350 font-mono font-bold flex items-center gap-1.5 leading-none animate-pulse">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Garante segurança, previsibilidade e escalabilidade.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO ALTAMENTE CONVERSIVA: CASOS DE SUCESSO DO CLIENTE */}
      <section className="space-y-8 text-left">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">CASE STUDIES DE ALTA PERFORMANCE</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">O que Diz quem Escolheu a KoreNexus</h2>
          <p className="text-xs text-slate-400">Resultados operacionais reais auditados nas cidades da nossa região de Jundiaí.</p>
        </div>

        {/* Industry switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-3xl mx-auto">
          {[
            { id: "industria", label: "🏭 Metalúrgica Jundiaí", subtitle: "Automação Fiscais & Sefaz" },
            { id: "distribuidora", label: "📦 Logística Itupeva", subtitle: "Apps de Campo Offline" },
            { id: "servicos", label: "🛠️ Serviços Várzea Paulista", subtitle: "Painéis Bento Real-time" }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setCaseStudyTab(opt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                caseStudyTab === opt.id
                  ? "bg-slate-900 border-indigo-500 text-white shadow-xl"
                  : "bg-[#0b0e17] border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
              }`}
            >
              <div className="text-xs font-extrabold font-sans">{opt.label}</div>
              <div className="text-[9px] text-slate-500 mt-0.5">{opt.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Case detail block */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#0d1222] to-[#080d15] border border-slate-850 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          {/* Text columns (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-400/20 rounded-full text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              🟢 PROVA DE VALOR VERIFICADA
            </div>
            
            <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-snug">
              {caseStudyTab === "industria" && "Processamento automático e emissão em lote de R$2.4 Milhões sem travamento fiscal"}
              {caseStudyTab === "distribuidora" && "Expedição de cargas sob controle com diminuição extrema de erros em Itupeva"}
              {caseStudyTab === "servicos" && "Visibilidade financeira total em tempo real eliminando atrasos em fechamentos"}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
              {caseStudyTab === "industria" && "A indústria metalúrgica enfrentava travamentos diários no faturamento de notas e atrasava entregas da produção. Desenvolvemos um barramento de mensageria síncrona que integrou o legado ao fisco em lote automático. Todo o processo funciona sob monitoramento e segurança integral em nuvem própria."}
              {caseStudyTab === "distribuidora" && "Com vendedores externos em rota e motoristas descarregando mercadorias sem internet estável, o estoque costumava ficar obsoleto. Implantamos o aplicativo offline nativo com sincronização inteligente automática em lote para expedição instantânea de cargas."}
              {caseStudyTab === "servicos" && "Cálculos manuais gigantescos de comissões de parceiros levavam quase 15 dias após o final do mês. Conectamos entradas de caixas locais de filiais ligando gateway de banco e geramos dashboards Bento real-time síncronos no smartphone do Diretor."}
            </p>

            <div className="flex items-center gap-3 bg-slate-950/20 p-3 rounded-xl border border-slate-900 w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-slate-400">Tempo de Implementação Geral: <strong>{caseStudyTab === "industria" ? "6 semanas" : caseStudyTab === "distribuidora" ? "8 semanas" : "5 semanas"}</strong></span>
            </div>
          </div>

          {/* Metrics column (5 cols) */}
          <div className="lg:col-span-5 bg-[#07090f] p-6 border border-slate-900 rounded-2xl space-y-4">
            <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-widest block">MÉTRICAS DO RETORNO OBTIDO:</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9.5px] text-slate-400 font-mono block">Economia de Tempo:</span>
                <strong className="text-sm font-bold text-white tracking-tight">
                  {caseStudyTab === "industria" && "82% menos cliques"}
                  {caseStudyTab === "distribuidora" && "-94% de tempo"}
                  {caseStudyTab === "servicos" && "Tempo Real imediato"}
                </strong>
              </div>
              <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9.5px] text-slate-400 font-mono block">Taxa de Erros:</span>
                <strong className="text-sm font-bold text-emerald-400 tracking-tight">0% Reclamações</strong>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1.5 text-left">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[10.5px] font-bold text-white">Retorno Financeiro Estimado:</span>
              </div>
              <span className="text-xl font-black text-emerald-400 block tracking-tight">
                {caseStudyTab === "industria" && "R$ 140.000,00 /ano salvos"}
                {caseStudyTab === "distribuidora" && "+28% no volume de entregas"}
                {caseStudyTab === "servicos" && "R$ 95.000,00 poupados de back-office"}
              </span>
              <p className="text-[9px] text-slate-400 leading-normal font-sans">
                {caseStudyTab === "industria" && "Eliminação de multas fiscais da Sefaz e horas extras desnecessárias operacionais."}
                {caseStudyTab === "distribuidora" && "Aceleração geral do ciclo comercial e melhora no faturamento no mesmo dia."}
                {caseStudyTab === "servicos" && "Automação síncrona de comissão em lote, sem erros manuais de contabilidade."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO ALTAMENTE CONVERSIVA: GARANTIAS EXECUTIVAS DE VERDADE */}
      <section className="bg-[#0b0e17]/80 rounded-3xl border border-slate-850 p-6 md:p-8 space-y-6 text-left shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <ShieldCheck className="h-32 w-32 text-emerald-400" />
        </div>

        <div className="max-w-2xl space-y-2">
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">ZERO RISCO / VALIDAÇÃO CIENTÍFICA</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Suas 4 Garantias Blindadas de Contratação</h2>
          <p className="text-xs text-slate-400">Trabalhamos sob segurança técnica, geográfica e jurídica absoluta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { 
              title: "⚖️ 100% de Autonomia Legal do Código", 
              desc: "Você possui a propriedade total de todo o código-fonte desenvolvido. O software pertence juridicamente à sua empresa, sem restrições ou retenção de chaves. Você tem liberdade e segurança completa para operar e crescer." 
            },
            { 
              title: "🚫 Isenção de Mensalidades de Software", 
              desc: "Pare de sangrar caixa em taxas ocultas ou licenciamento eterno de usuários. Cobramos apenas pelo projeto executado de engenharia de software e hospedamos os arquivos diretamente na sua própria nuvem estável." 
            },
            { 
              title: "🗼 Suporte Físico e Regional Imediato", 
              desc: "Nosso escritório atua de forma dedicada em Jundiaí e região com engenheiros seniores prontos para atendimentos in-loco rápidos em até 15 minutos em dias úteis, garantindo estabilidade e proximidade física." 
            },
            { 
              title: "⚙️ Desenvolvimento Iterativo em 7 Dias", 
              desc: "Nas nossas sprints rápidas, você confere e valida protótipos funcionais da sua ferramenta todas as semanas em ambiente de homologação privado, sem esperar meses para ver os resultados tangíveis." 
            }
          ].map((item, idx) => (
            <div key={idx} className="p-5 bg-[#07090f] border border-slate-900 rounded-2xl space-y-2 relative group hover:border-indigo-500/20 transition-all duration-300">
              <h4 className="text-sm font-bold text-white font-sans">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-indigo-950/10 border border-indigo-900/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
            <p className="text-xs text-slate-300 font-sans text-center sm:text-left">Deseja simular o escopo de contrato e prazos detalhados para sua empresa hoje?</p>
          </div>
          
          <button
            onClick={() => {
              const msg = `Olá! Gostaria de agendar de forma prioritária o atendimento gratuito para debater o escopo e garantias do software da minha empresa no padrão KoreNexus.`;
              window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
            }}
            className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Falar com o Diretor de Tecnologia</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* SEÇÃO ALTAMENTE PERSUASIVA: MATRIZ DE DEBATE DO CEO (CONTRATAR VS SQUAD KORENEXUS) */}
      <section className="bg-gradient-to-b from-[#090d16] to-[#060a12] rounded-3xl border border-slate-850 p-6 md:p-8 space-y-8 text-left shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">DECISÃO ESTRATÉGICA DO CEO</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Squad Dedicado KoreNexus vs. Contratação Interna CLT</h2>
          <p className="text-xs text-slate-400">Compare os custos ocultos, tempo de recrutamento e responsabilidades de montar uma equipe interna de TI contra contratar o Squad Sênior da KoreNexus.</p>
        </div>

        {/* Level selector buttons */}
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          {[
            { level: 2, label: "Equipe Pequena (2 Devs)" },
            { level: 4, label: "Time Médio (4 Devs)" },
            { level: 8, label: "Time Completo (8 Devs)" }
          ].map(opt => (
            <button
              key={opt.level}
              onClick={() => setCompareTeamSize(opt.level)}
              type="button"
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                compareTeamSize === opt.level
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "bg-slate-900 border border-slate-850 text-slate-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Internal Crew */}
          <div className="p-6 bg-[#0E0F16] border border-red-500/10 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-red-500/10">
                <h3 className="text-xs font-mono font-black text-red-400 uppercase tracking-widest">⚠️ MONTAR TIME INTERNO (CLT)</h3>
                <span className="text-[11px] font-mono text-slate-500">Alto Risco Trabalhista</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Custo Operacional de Equipe Recorrente:</span>
                  <div className="text-xl font-bold text-white tracking-tight">
                    {compareTeamSize === 2 && "Alto Encargo CLT (2 Devs)"}
                    {compareTeamSize === 4 && "Custo Extra Crítico (4 Devs)"}
                    {compareTeamSize === 8 && "Orçamento Corporativo Máximo (8 Devs)"}
                  </div>
                  <span className="text-[9px] text-red-400 block leading-tight">Incluso salários de mercado, 13º, férias, FGTS (+80% encargos CLT reais) e benefícios obrigatórios.</span>
                </div>

                <div className="space-y-2 text-xs text-slate-400 font-sans">
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Hunting demorado</strong>: Leva de 45 a 120 dias entre triagem, entrevistas de código e contratação final.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Setup Inicial Caro</strong>: Aquisição de notebooks de alta performance, licenciamento obrigatório de Slack/Jira.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Risco de Turnover</strong>: Se o desenvolvedor principal se demitir, o projeto para totalmente por semanas.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Gestão e Treinamento</strong>: Sua gerência precisa gastar tempo precioso ditando regras, coordenando código e arquiteturas.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900/40 text-[10.5px] text-red-300 font-mono italic">
              ↳ Custo de contratação de longo prazo e lentidão alta de faturamento.
            </div>
          </div>

          {/* KoreNexus Squad */}
          <div className="p-6 bg-gradient-to-br from-[#0c1622] to-[#0a101b] border border-emerald-500/20 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500/10 border-b border-l border-emerald-500/20 px-3 py-1 rounded-bl-xl text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest animate-pulse">
              100% DE EFICIÊNCIA
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-500/15">
                <h3 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest">✨ SQUAD KORENEXUS (ON-DEMAND)</h3>
                <span className="text-[11px] font-mono text-emerald-400 font-bold animate-pulse">Início em 48h Úteis</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Custo Total Previsível de Projeto:</span>
                  <div className="text-2xl font-bold text-emerald-450 tracking-tight flex items-baseline gap-1.5">
                    <span>Até 65% mais econômico</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 block leading-tight">Valor fechado por Sprint de desenvolvimento. Sem encargos, sem passivos, e sem computadores caros.</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-sans">
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Velocidade Única</strong>: Sprints rápidas semanais. Entregamos os primeiros códigos e telas homologados em 7 dias.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Profissionais Sêniores</strong>: Desenvolvedores seniores, Product Managers e Arquitetos inclusos na entrega final.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Código e Documentação no GitHub</strong>: Todo o repositório é seu de forma limpa por contrato jurídico.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>0 Risco de Rotatividade</strong>: Se qualquer especialista do squad precisar ausentar-se, nós substituímos sem pausa técnica.</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const msg = `Olá! Vi a tabela de debate de contratar squad dedicado vs programadores internos CLT (${compareTeamSize} desenvolvedores) no site. Gostaria de entender como funciona a precificação de sprints da KoreNexus!`;
                window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-650 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Consultar Viabilidade do Squad p/ minha Empresa</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO ALTAMENTE CONVERSIVA: RESOLVEDOR DE OBJEÇÕES TÉCNICAS */}
      <section className="bg-[#0b0e17]/80 rounded-3xl border border-slate-850 p-6 md:p-8 space-y-6 text-left shadow-xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">DESTRUIDOR DE BARREIRAS / DÚVIDAS COMERCIAIS</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Suas Dúvidas Técnicas Resolvidas em 1 Clique</h2>
          <p className="text-xs text-slate-400">Clique nas perguntas comuns dos diretores financeiro e TI e veja a resposta da Engenharia KoreNexus de forma transparente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          {/* Left: Buttons list (5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 space-y-2">
            {[
              { idx: 0, title: "🔌 Mapeamento de Integ. de Legados", icon: "🔌" },
              { idx: 1, title: "⚖️ Autonomia Legal vs Lock-In", icon: "⚖️" },
              { idx: 2, title: "🚨 Suporte e SLAs Estaduais", icon: "🚨" },
              { idx: 3, title: "📅 Riscos e Previsão de Entrega", icon: "📅" }
            ].map(item => (
              <button
                key={item.idx}
                onClick={() => setActiveObjection(item.idx)}
                type="button"
                className={`w-full p-4 rounded-xl border text-left transition-all duration-350 cursor-pointer flex items-center justify-between group ${
                  activeObjection === item.idx
                    ? "bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-550/5"
                    : "bg-[#090d16] border-slate-900 text-slate-450 hover:border-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-bold font-sans leading-tight">{item.title}</span>
                </div>
                <ChevronRight className={`h-4 w-4 text-slate-500 group-hover:translate-x-0.5 transition-transform ${activeObjection === item.idx ? "text-indigo-400 translate-x-0.5" : ""}`} />
              </button>
            ))}
          </div>

          {/* Right: Answer Display (7 cols) */}
          <div className="md:col-span-12 lg:col-span-7 bg-[#07090f] border border-slate-900 p-6 rounded-2xl space-y-4">
            {(() => {
              const answers = [
                {
                  q: "Nosso sistema legado (ERP antigo com banco relacional de 15 anos) é muito complexo. Dá realmente para acoplar sem paralisar o faturamento?",
                  title: "Integração Sem Riscos",
                  answer: "Sim, com absoluta segurança. Nós construímos microsserviços isolados com barramento de mensageria persistente e queues robustas. Criamos scripts de sincronização em segundo plano que transferem os dados de faturamento à nuvem e escrevem no banco antigo nos bastidores sob monitoramento constante. Rodamos um período em paralelo ('shadow-mode') para que sua expedição continue faturando 100% estável e você mude somente após homologação completa."
                },
                {
                  q: "Como garanto que o código é realmente meu e não ficarei atrelado a cobranças extras?",
                  title: "Soberania Tecnológica Total",
                  answer: "O código é registrado 100% em nome da sua empresa no GitHub. Não cobramos royalties abusivos, licenças por novos funcionários ou taxas infinitas de armazenamento. A KoreNexus é paga pelo serviço de engenharia de software entregue e o banco de dados rola na sua própria infraestrutura de nuvem, mantendo sua empresa autônoma."
                },
                {
                  q: "E se houver uma pane fiscal ou erro de emissores XML no faturamento no meio da madrugada?",
                  title: "Suporte Imediato in-loco SP",
                  answer: "Garantimos suporte regional sênior com SLAs de 15 minutos em Jundiaí e região. Como mantemos engenheiros dedicados na Grande São Paulo, estamos prontos para atuar nos servidores ou realizar planos de contingência técnica de expedição in-loco imediatamente, se necessário."
                },
                {
                  q: "Como de me certifico de que os prazos serão cumpridos e o orçamento não vai estourar?",
                  title: "Garantia de Previsibilidade Ágil",
                  answer: "Trabalhamos com Sprints Quinzenais fixas. A cada ciclo rápido de 7 dias de engenharia, você confere, clica e valida uma funcionalidade em ambiente de homologação privado. Não há surpresas ruins no final do contrato: você acompanha os códigos e sabe exatamente cada avanço técnico."
                }
              ];

              const current = answers[activeObjection];
              return (
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-400/20 px-2 py-0.5 rounded w-fit block">
                    {current.title}
                  </span>
                  <h3 className="text-sm font-extrabold text-white leading-snug font-sans">
                    "{current.q}"
                  </h3>
                  <div className="h-[1px] bg-slate-900 w-full"></div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                    {current.answer}
                  </p>
                  <button
                    onClick={() => {
                      const msg = `Olá! Quero debater a seguinte dúvida de escopo: "${current.q}". Gostaria de agendar uma conversa técnica de viabilidade!`;
                      window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors mt-2 cursor-pointer"
                  >
                    <span>Falar com Engenheiro do Caso</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      </div>

      {/* 5. Animated Interactive Process Timeline */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">METODOLOGIA AGILE</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">O Fluxo da Concepção ao Deploy</h2>
          <p className="text-xs text-slate-400">Transparência extrema e entregas rápidas semanais em homologação restrita.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Briefing de Escopo", desc: "Varremos seus gargalos e regras operacionais em uma reunião dinâmica de 1 hora.", icon: <Search className="h-5 w-5 text-indigo-400" /> },
            { step: "02", title: "Arquitetura Visual", desc: "Criamos fluxogramas, telas de alta usabilidade e esquemas de dados inovadores.", icon: <Sliders className="h-5 w-5 text-blue-400" /> },
            { step: "03", title: "Codificação do Core", desc: "Entregas parciais contínuas em ambiente de homologação privado todas as semanas.", icon: <Cpu className="h-5 w-5 text-purple-400" /> },
            { step: "04", title: "Deploys & Suporte", desc: "Hospedamos na sua nuvem de escolha com auditoria, segurança e h24/7 SLA.", icon: <ShieldCheck className="h-5 w-5 text-emerald-400" /> }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setSimActiveStep(idx)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                simActiveStep === idx 
                  ? "bg-[#111622] border-indigo-500 shadow-xl" 
                  : "bg-[#0b0e17] border-slate-850 hover:border-slate-800 text-slate-450"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-mono font-bold text-slate-650">{item.step}</span>
                  <div className={`p-2 rounded-lg ${simActiveStep === idx ? "bg-indigo-500/15" : "bg-slate-800/20"}`}>
                    {item.icon}
                  </div>
                </div>
                <h4 className={`text-sm font-bold font-sans mb-2 ${simActiveStep === idx ? "text-white" : "text-slate-300"}`}>{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.desc}</p>
              </div>
              {simActiveStep === idx && (
                <div className="h-0.5 bg-indigo-500 rounded-full w-full mt-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Grid of Key Features (Now as Interactive Expandable Cards) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block animate-pulse">SOLUÇÕES SOB MEDIDA</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Desenvolvimento de Softwares sob Medida: Nossas Especialidades</h2>
          <p className="text-xs text-slate-400">Clique nas frentes para abrir as especificações técnicas de infraestrutura e prazos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 0,
              title: "ERPs e Sistemas Operacionais",
              shortDesc: "Acompanhamos o andamento operacional de faturamento, emissão de notas com aprovação XML, estoques e painéis.",
              icon: <Layers className="h-5 w-5 text-blue-400" />,
              accentClass: "hover:border-blue-500/50",
              bgColor: "bg-blue-500/5",
              techStack: ["React + TypeScript", "PostgreSQL / Prisma", "Node.js (NestJS)", "AWS / Google Cloud Run"],
              database: "PostgreSQL e Redis para caching",
              timeframe: "4 a 6 semanas",
              fullDetails: "Criamos painéis síncronos leves integrados à Sefaz. Nossa arquitetura suporta backups em nuvem redundantes de 12 em 12 horas, consulta rápida de faturamento instantâneo por período fiscal e conformidade mecânica com a LGPD em Jundiaí."
            },
            {
              id: 1,
              title: "Apps Nativos e Desconectados",
              shortDesc: "Especialistas em aplicativos offline automáticos. Sincronização inteligente para campo, transporte rural ou inspeções.",
              icon: <Smartphone className="h-5 w-5 text-emerald-400" />,
              accentClass: "hover:border-emerald-500/50",
              bgColor: "bg-emerald-500/5",
              techStack: ["React Native / Expo", "SQLite Local", "WatermelonDB síncrono", "Node.js + Websockets"],
              database: "SQLite (Celular) com sincronização PostgreSQL",
              timeframe: "6 a 8 semanas",
              fullDetails: "Aplicativos móveis projetados para operar com zero sinal de operadora. Todos os cadastros, ordens de serviço e coletas de assinaturas são arquivados localmente e criptografados. Ao restabelecer sinal, o app sincroniza em lote automaticamente e síncrona nos bastidores."
            },
            {
              id: 2,
              title: "Integração de APIs e Microsserviços",
              shortDesc: "Barramentos de microsserviços seguros. Integramos faturadores em lote, legados, gateways de pagamento e bots de chat.",
              icon: <Cpu className="h-5 w-5 text-purple-400" />,
              accentClass: "hover:border-purple-500/50",
              bgColor: "bg-purple-500/5",
              techStack: ["Typescript / Go", "Docker & Kubernetes", "RabbitMQ / BullMQ", "OpenAPI / Swagger"],
              database: "Redis / MongoDB para tráfego em lote",
              timeframe: "3 a 5 semanas",
              fullDetails: "Construção de pontes de dados seguras. Ideal para se livrar de travas ou filas lentas de faturamento. Isola os dados de faturamento do seu ERP antigo lento, processando chamadas críticas com filas de mensageria síncronas que anulam duplicidades e perdas."
            },
            {
              id: 3,
              title: "Estoque WMS e Logística Industrial",
              shortDesc: "Organize armazéns com rastreio de QR Codes, automatize o picking e integre as remessas diretamente com faturamentos Sefaz.",
              icon: <Activity className="h-5 w-5 text-indigo-400" />,
              accentClass: "hover:border-indigo-500/50",
              bgColor: "bg-indigo-500/5",
              techStack: ["React / NextJS", "Node.js (TypeScript)", "RabbitMQ para filas", "Sefaz API Integrator"],
              database: "PostgreSQL e Redis de alta velocidade",
              timeframe: "5 a 7 semanas",
              fullDetails: "Software completo para acelerar expedição industrial e de e-commerce. Acompanhe a cubagem das prateleiras em tempo real, faça a leitura de QR Codes e gere as Notas Fiscais Eletrônicas em lote em menos de 2 segundos de forma ágil e síncrona."
            },
            {
              id: 4,
              title: "Portaria Inteligente e Controle de Pátio",
              shortDesc: "Automação facial de pátios, motoristas, vistorias de caminhões e leitura biométrica integrada com a LGPD.",
              icon: <Lock className="h-5 w-5 text-rose-450" />,
              accentClass: "hover:border-rose-500/50",
              bgColor: "bg-rose-500/5",
              techStack: ["FastAPI (Python)", "OCR Plate Recognition", "SQLite criptografado", "WebRTC Video"],
              database: "PostgreSQL isolado para criptografia",
              timeframe: "6 a 8 semanas",
              fullDetails: "Proteja as saídas e entradas de carga da sua fábrica. Com leitura OCR automática de placas diretamente do fluxo de vídeo CFTV e validação de documentos, nosso sistema garante fluxo instantâneo de frotas e previne gargalos físicos de transportadoras."
            },
            {
              id: 5,
              title: "Chatbots e Automações de Atendimento WhatsApp",
              shortDesc: "Atenda clientes, faça triagens de chamados, envie boletos de faturamento em lote de forma autônoma sem mensalidade extra.",
              icon: <MessageSquare className="h-5 w-5 text-sky-400" />,
              accentClass: "hover:border-sky-500/50",
              bgColor: "bg-sky-500/5",
              techStack: ["WhatsApp Cloud API", "Express.js / Node", "FlowBuilder Engine", "Redis queues"],
              database: "MongoDB ou PostgreSQL para histórico",
              timeframe: "3 a 5 semanas",
              fullDetails: "Crie agentes automatizados de conversas de alto padrão para agilizar vendas e faturamento de forma independente. Sem limitações e pagando apenas os custos puros da Meta API, centralize o fluxo de mensagens de todos os seus departamentos na nuvem."
            }
          ].map((item) => {
            const isExpanded = expandedSpecialty === item.id;
            return (
              <div 
                key={item.id}
                id={`specialty-card-${item.id}`}
                className={`bg-[#111622] border transition-all duration-300 rounded-3xl p-6 group flex flex-col justify-between shadow-sm overflow-hidden text-left ${
                  isExpanded ? "border-indigo-500 md:col-span-3 bg-[#0d1222]" : `border-slate-850 ${item.accentClass}`
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${item.bgColor} border border-white/5`}>
                      {item.icon}
                    </div>
                    <button 
                      onClick={() => setExpandedSpecialty(isExpanded ? null : item.id)}
                      className="px-3 py-1 bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/30 text-[10px] font-mono text-slate-400 hover:text-indigo-400 font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {isExpanded ? "Recolher Detalhes ▲" : "Ver Especificação Técnica ▼"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-display font-bold text-white transition-colors group-hover:text-indigo-400">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.shortDesc}</p>
                  </div>

                  {/* Expandable Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 mt-4 border-t border-slate-800 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="p-3 bg-slate-950/45 rounded-xl border border-slate-900 space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Tecnologias Utilizadas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.techStack.map((tech, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 font-mono text-[9px] rounded font-bold">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 bg-slate-950/45 rounded-xl border border-slate-900 space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Armazenamento Base:</span>
                            <span className="font-bold text-slate-200 mt-1 block">{item.database}</span>
                          </div>

                          <div className="p-3 bg-slate-950/45 rounded-xl border border-slate-900 space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Sprint / Cronograma Médio:</span>
                            <span className="font-bold text-emerald-400 mt-1 block">{item.timeframe} de desenvolvimento</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl leading-relaxed text-xs text-slate-300 font-sans">
                          {item.fullDetails}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              const msg = `Olá! Estive analisando o Expandable Card de "${item.title}" no padrão KoreNexus. Gostaria de solicitar um orçamento ou briefing de viabilidade desse módulo para minha empresa.`;
                              window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Debater Projeto no WhatsApp</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NOVO RECURSO DE ACORDEÃO PREMIUM: OS 5 PILARES DE SOBERANIA TECNOLÓGICA (O que precisa saber para fechar negócio) */}
      <section className="bg-[#0b0e17]/85 border border-slate-850 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block animate-pulse">SÃO DETALHES DE FECHAMENTO</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
            Os 5 Pilares de Decisão KoreNexus
          </h2>
          <p className="text-xs text-slate-400">
            Antes de assinar com qualquer outro fornecedor, entenda o padrão de soberania técnica, velocidade técnica e as garantias comerciais que oferecemos.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {[
            {
              id: 0,
              title: "⚖️ 1. Soberania e Propriedade Jurídica Total do Código (0% Lock-in)",
              subtitle: "Seu sistema é patrimônio legal da sua empresa",
              content: "Ao contrário das softhouses tradicionais, nós registramos todo o código-fonte desenvolvido no seu próprio repositório GitHub. Não existem royalties de uso, taxas de licença abusivas ou retenção de chaves criptográficas. O software desenvolvido pertence 100% legalmente a você, permitindo total liberdade de manutenção futura, venda ou auditorias corporativas."
            },
            {
              id: 1,
              title: "🚫 2. Isenção Absoluta de Mensalidades de Software de Terceiros",
              subtitle: "Pare de sangrar caixa com locação engessada de usuários",
              content: "Você paga única e exclusivamente pelas sprints de desenvolvimento e arquitetura estregas de engenharia. Toda a infraestrutura roda na sua conta de nuvem particular (AWS ou Google Cloud) sob custos operacionais puros e lineares. Se a sua empresa crescer de 10 para 500 colaboradores ativos, o custo de licenciamento permanece absolutamente zero. O sistema é seu."
            },
            {
              id: 2,
              title: "🗼 3. Suporte Físico Presencial Regional em até 15 Minutos",
              subtitle: "Garantia física de operação em Jundiaí e região de lote industrial",
              content: "Nossos engenheiros sêniores residem e operam presencialmente na Grande Jundiaí (Itupeva, Várzea Paulista, Campo Limpo Paulista, etc). Se houver alguma pane fiscal complexa de notas fiscais em lote ou travamento de pátio industrial, oferecemos SLAs contratuais de atendimento instantâneo remoto e visitas técnicas locais in-loco síncronas para homologar sua expedição."
            },
            {
              id: 3,
              title: "🛡️ 4. Segurança de Integridade Bancária & Proteção Estrita sob a LGPD",
              subtitle: "Criptografia militar de dados de faturamento e frotas de campo",
              content: "Seus dados operacionais históricos não são expostos a portais terceiros obscuros. Desenhamos bancos locais isolados com proteção SSL síncrona habilitada, mascaramento de informações de motoristas ou RG de visitantes por controle de segurança bio-facial e chaves rotacionadas automáticas. Sua corporação estará totalmente protegida contra multas de auditorias federais brasileira."
            },
            {
              id: 4,
              title: "📲 5. Tecnologia Offline Síncrona Avançada para Dispositivos de Campo",
              subtitle: "A sua expedição comercial fatura e lança pedidos sem internet",
              content: "Criamos aplicativos nativos eficientes e otimizados com armazenamento SQLite criptografado celular de alta retenção. Os operadores de campo ou motoristas registram cargas e coletas com zero conexão de operadora. Assim que o aparelho reencontrar sinal na estrada de faturamento estadual, a sincronização síncrona ocorre em lote de fundo de forma instantânea sem gargalos."
            }
          ].map((pilar) => {
            const isOpen = activePilar === pilar.id;
            return (
              <div 
                key={pilar.id} 
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? "bg-[#0c101a] border-indigo-500/80 shadow-md shadow-indigo-550/5" : "bg-[#07090f] border-slate-900 hover:border-slate-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActivePilar(isOpen ? null : pilar.id)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none select-none"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs md:text-sm font-extrabold text-white font-sans">{pilar.title}</h3>
                    <p className="text-[10.5px] text-slate-500 font-sans font-normal">{pilar.subtitle}</p>
                  </div>
                  <div className={`p-1.5 bg-slate-950 border border-slate-850 rounded-lg transition-transform duration-300 ${isOpen ? "rotate-180 border-indigo-500/50" : ""}`}>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-450" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-4 md:p-5 pt-0 border-t border-slate-900 border-dashed text-xs text-slate-300 leading-relaxed font-sans space-y-3">
                        <p>{pilar.content}</p>
                        <button
                          onClick={() => {
                            const msg = `Olá! Gostaria de falar com o especialista Yugny sobre o pilar de decisão: "${pilar.title}" e debater o escopo da minha empresa!`;
                            window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(msg)}`, "_blank");
                          }}
                          className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold font-sans text-[10px] rounded-lg border border-indigo-400/20 hover:border-indigo-500/30 transition-colors w-fit flex items-center gap-1 mt-2"
                        >
                          <span>Validar isto com Yugny no WhatsApp</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Quick Info Block */}
      <div className="bg-[#111622] p-6 rounded-2xl border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-6 text-center shadow-md items-center">
        <div className="space-y-1">
          <span className="text-xs text-slate-500 font-mono uppercase font-bold">Estrutura de Suporte</span>
          <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5 font-sans">
            <Activity className="h-4 w-4 text-blue-500" />
            Suporte Técnico Proximidade
          </p>
          <span className="text-[10px] text-blue-400 block font-medium">SLA de 15 Minutos • Jundiaí e região</span>
        </div>

        <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0">
          <span className="text-xs text-slate-500 font-mono uppercase font-bold">Contato Direto</span>
          <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5 leading-none">
            <Mail className="h-4 w-4 text-blue-450" />
            contato@korenexus.com.br
          </p>
          <span className="text-[10px] text-slate-500 font-sans block pt-1.5">Consultoria de engenheiros locais</span>
        </div>

        <div className="space-y-1 font-sans">
          <span className="text-xs text-slate-500 font-mono uppercase font-bold">Projetos & WhatsApp</span>
          <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5">
            <Phone className="h-4 w-4 text-emerald-500" />
            (11) 98938-7263
          </p>
          <a href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Vim%20pelo%20site%20korenexus.com.br" target="_blank" className="text-[10px] text-emerald-450 hover:underline block font-semibold">Iniciar Briefing Comercial</a>
        </div>
      </div>

      {/* 8. FAQ Block */}
      <FaqSection pageId="inicio" />
    </motion.div>
  );
}
