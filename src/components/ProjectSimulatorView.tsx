import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  Database, 
  Cpu, 
  Zap, 
  Sparkles, 
  Smartphone, 
  Layers, 
  Shield, 
  Check, 
  Activity, 
  Info, 
  Sliders, 
  Calendar, 
  DollarSign, 
  Wrench, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Lock, 
  RefreshCw,
  Send,
  AlertCircle,
  User,
  Building
} from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db as firestoreDb } from "../firebase";

type ClientProfileType = "cpf" | "pme" | "enterprise";
type ServiceType = "web-site" | "web-app" | "mobile-app" | "custom-service";
type ScaleType = "small" | "medium" | "large";
type DatabaseType = "none" | "client" | "korenexus";
type ApiIntegrationType = "none" | "standard" | "complex";
type AiIntegrationType = "none" | "basic" | "advanced";
type SupportPlanType = "standard" | "premium" | "enterprise";

interface AdditionalFeatures {
  auth: boolean;
  notifications: boolean;
  realtime: boolean;
  offline: boolean;
  saas: boolean;
}

const playBeep = (freq = 1100, duration = 0.05, type: OscillatorType = "sine") => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime); // Soft and comfortable
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // fine if blocked by browser
  }
};

export default function ProjectSimulatorView() {
  // Simulator form states
  const [clientProfile, setClientProfile] = useState<ClientProfileType>("pme");
  const [service, setService] = useState<ServiceType>("web-app");
  const [scale, setScale] = useState<ScaleType>("medium");
  const [database, setDatabase] = useState<DatabaseType>("korenexus");
  const [dbUsage, setDbUsage] = useState<"low" | "medium" | "high">("low");
  const [api, setApi] = useState<ApiIntegrationType>("standard");
  const [apiUsage, setApiUsage] = useState<"low" | "medium" | "high">("low");
  const [ai, setAi] = useState<AiIntegrationType>("none");
  
  const [features, setFeatures] = useState<AdditionalFeatures>({
    auth: true,
    notifications: false,
    realtime: false,
    offline: false,
    saas: false,
  });

  const [support, setSupport] = useState<SupportPlanType>("standard");

  // Lead contact form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleFeatureToggle = (key: keyof AdditionalFeatures) => {
    setFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculation pricing logic
  const pricingData = useMemo(() => {
    let basePrice = 520;
    let baseTime = 1;
    let serviceLabel = "Site Institucional / Landing Page";

    switch (service) {
      case "web-site":
        basePrice = 520;
        baseTime = 1;
        serviceLabel = "Site Institucional / Portal";
        break;
      case "web-app":
        basePrice = 620;
        baseTime = 2;
        serviceLabel = "Sistema Web Customizado / ERP / CRM";
        break;
      case "mobile-app":
        basePrice = 720;
        baseTime = 3;
        serviceLabel = "Aplicativo Mobile (iOS & Android)";
        break;
      case "custom-service":
        basePrice = 580;
        baseTime = 2;
        serviceLabel = "Automação / RPA / Microsserviço Customizado";
        break;
    }

    let scalePrice = 0;
    let scaleTime = 0;
    let scaleLabel = "Pequeno Porte (MVP / Fluxo Enxuto)";

    switch (scale) {
      case "small":
        scalePrice = 0;
        scaleTime = 0;
        scaleLabel = "Pequeno Porte (MVP / Fluxo Enxuto)";
        break;
      case "medium":
        scalePrice = 50;
        scaleTime = 1;
        scaleLabel = "Médio Porte (Corporativo / Fluxo Robusto)";
        break;
      case "large":
        scalePrice = 100;
        scaleTime = 2;
        scaleLabel = "Grande Porte (Enterprise / Alta Complexidade)";
        break;
    }

    let dbPrice = 0;
    let dbMonthly = 0;
    let dbLabel = "Sem banco de dados integrado";

    switch (database) {
      case "none":
        dbPrice = 0;
        dbMonthly = 0;
        dbLabel = "Sem banco de dados integrado";
        break;
      case "client":
        dbPrice = 0;
        dbMonthly = 0;
        if (dbUsage === "low") {
          dbLabel = "Banco de Dados do Cliente (Baixo Uso)";
        } else if (dbUsage === "medium") {
          dbLabel = "Banco de Dados do Cliente (Médio Uso)";
        } else {
          dbLabel = "Banco de Dados do Cliente (Alto Uso/Enterprise)";
        }
        break;
      case "korenexus":
        if (dbUsage === "low") {
          dbPrice = 30;
          dbMonthly = 15;
          dbLabel = "Banco Dedicado na Nuvem KN (Baixo Uso - até 10k reg.)";
        } else if (dbUsage === "medium") {
          dbPrice = 60;
          dbMonthly = 29;
          dbLabel = "Banco Dedicado na Nuvem KN (Médio Uso - até 250k reg.)";
        } else {
          dbPrice = 90;
          dbMonthly = 59;
          dbLabel = "Banco Dedicado na Nuvem KN (Alto Uso - Escala Ilimitada)";
        }
        break;
    }

    let apiPrice = 0;
    let apiTime = 0;
    let apiLabel = "Sem integrações de APIs externas";

    switch (api) {
      case "none":
        apiPrice = 0;
        apiTime = 0;
        apiLabel = "Sem integrações de APIs externas";
        break;
      case "standard":
        apiPrice = 0; // Por uso/consumo, sem custo de setup
        apiTime = 1;
        if (apiUsage === "low") {
          apiLabel = "APIs Padrão (Baixo Uso - Cobrado por Consumo)";
        } else if (apiUsage === "medium") {
          apiLabel = "APIs Padrão (Médio Uso - Cobrado por Consumo)";
        } else {
          apiLabel = "APIs Padrão (Alto Uso - Cobrado por Consumo)";
        }
        break;
      case "complex":
        apiPrice = 0; // Por uso/consumo, sem custo de setup
        apiTime = 2;
        if (apiUsage === "low") {
          apiLabel = "APIs Complexas (Baixo Uso - Cobrado por Consumo)";
        } else if (apiUsage === "medium") {
          apiLabel = "APIs Complexas (Médio Uso - Cobrado por Consumo)";
        } else {
          apiLabel = "APIs Complexas (Alto Uso - Cobrado por Consumo)";
        }
        break;
    }

    let aiPrice = 0;
    let aiMonthly = 0;
    let aiLabel = "Sem Inteligência Artificial";

    switch (ai) {
      case "none":
        aiPrice = 0;
        aiMonthly = 0;
        aiLabel = "Sem Inteligência Artificial";
        break;
      case "basic":
        aiPrice = 0; // Por uso, sem taxa de setup
        aiMonthly = 0; // Sem mensalidade fixa de IA
        aiLabel = "IA Básica (Textos, Resumos - Cobrado por Consumo / Uso)";
        break;
      case "advanced":
        aiPrice = 0; // Por uso, sem taxa de setup
        aiMonthly = 0; // Sem mensalidade fixa de IA
        aiLabel = "IA Avançada (RAG, Agentes Autônomos - Cobrado por Consumo / Uso)";
        break;
    }

    // Additional features pricing - All free/included (+R$ 0) as requested!
    let additionalPrice = 0;
    let additionalMonthly = 0;
    const activeFeaturesList: string[] = [];

    if (features.auth) {
      activeFeaturesList.push("Controle de Acessos & Perfis");
    }
    if (features.notifications) {
      activeFeaturesList.push("Notificações em Tempo Real / Push");
    }
    if (features.realtime) {
      activeFeaturesList.push("Sincronização / Telas Colaborativas");
    }
    if (features.offline) {
      activeFeaturesList.push("Modo Offline & Tecnologia PWA");
    }
    if (features.saas) {
      activeFeaturesList.push("Arquitetura Multi-tenant SaaS");
    }

    let supportMonthly = 19;
    let supportLabel = "Suporte Padrão (Atendimento 9/5 em horário comercial)";

    switch (support) {
      case "standard":
        supportMonthly = 19;
        supportLabel = "Suporte Padrão (Atendimento 9/5 em horário comercial)";
        break;
      case "premium":
        supportMonthly = 49;
        supportLabel = "Suporte Premium SLA (24/7, monitoramento ativo)";
        break;
      case "enterprise":
        supportMonthly = 99;
        supportLabel = "Suporte Enterprise (Engenheiro Dedicado, Auditoria de Core-speed)";
        break;
    }

    // Adjusting parameters based on contracting profile
    let setupMultiplier = 1.0;
    let profileLabel = "Média / Grande Empresa (Enterprise / CNPJ)";
    let profileDiscountText = "";

    if (clientProfile === "cpf") {
      setupMultiplier = 0.90; // 10% discount for individual personal projects
      profileLabel = "Pessoa Física / Freelancer (CPF)";
      profileDiscountText = "Condição CPF Ativa: Desconto de 10% no desenvolvimento";
      
      // adjust monthly database hosting and support for CPF
      if (database === "korenexus") {
        if (dbUsage === "low") dbMonthly = 9;
        else if (dbUsage === "medium") dbMonthly = 19;
        else dbMonthly = 39;
      }
      
      if (support === "standard") supportMonthly = 9;
      else if (support === "premium") supportMonthly = 29;
      else if (support === "enterprise") supportMonthly = 59;

    } else if (clientProfile === "pme") {
      setupMultiplier = 0.95; // 5% discount for SME
      profileLabel = "PME / MEI / Startup";
      profileDiscountText = "Condição PME Ativa: Desconto de 5% no desenvolvimento";

      if (database === "korenexus") {
        if (dbUsage === "low") dbMonthly = 12;
        else if (dbUsage === "medium") dbMonthly = 24;
        else dbMonthly = 49;
      }

      if (support === "standard") supportMonthly = 15;
      else if (support === "premium") supportMonthly = 39;
      else if (support === "enterprise") supportMonthly = 79;
    } else {
      // Enterprise defaults
      if (database === "korenexus") {
        if (dbUsage === "low") dbMonthly = 15;
        else if (dbUsage === "medium") dbMonthly = 29;
        else dbMonthly = 59;
      }

      if (support === "standard") supportMonthly = 19;
      else if (support === "premium") supportMonthly = 49;
      else if (support === "enterprise") supportMonthly = 99;
    }

    const totalSetupMin = Math.round((basePrice + scalePrice + dbPrice + apiPrice + aiPrice + additionalPrice) * setupMultiplier);
    const totalSetupMax = Math.round(totalSetupMin * 1.15);
    const totalMonthly = dbMonthly + aiMonthly + additionalMonthly + supportMonthly;
    const totalWeeks = Math.max(1, Math.round((baseTime + scaleTime + apiTime) * (clientProfile === "cpf" ? 0.8 : clientProfile === "pme" ? 0.9 : 1.0)));

    // Recommended Tier name
    let tierName = "KN-Agile MVP";
    if (totalSetupMin >= 720 || scale === "large") {
      tierName = "KN-Enterprise Suite";
    } else if (totalSetupMin >= 550 || scale === "medium") {
      tierName = "KN-Growth Core";
    } else {
      tierName = "KN-Personal Lite";
    }

    return {
      serviceLabel,
      scaleLabel,
      dbLabel,
      apiLabel,
      aiLabel,
      supportLabel,
      activeFeaturesList,
      totalSetupMin,
      totalSetupMax,
      totalMonthly,
      totalWeeks,
      tierName,
      profileLabel,
      profileDiscountText,
      setupMultiplier
    };
  }, [service, scale, database, dbUsage, api, apiUsage, ai, features, support, clientProfile]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!nome.trim() || !email.trim() || !whatsapp.trim()) {
      setValidationError("Por favor, preencha nome, e-mail e celular/WhatsApp para gerar o orçamento.");
      return;
    }

    setIsSubmitting(true);

    const leadId = "deal-" + Date.now();
    const simulatedPlanDetails = `
PERFIL DO CONTRATANTE: ${pricingData.profileLabel}
TIPO DE SERVIÇO: ${pricingData.serviceLabel}
ESCALA DO PROJETO: ${pricingData.scaleLabel}
BANCO DE DADOS: ${pricingData.dbLabel}
INTEGRAÇÃO DE APIS: ${pricingData.apiLabel}
INTELIGÊNCIA ARTIFICIAL: ${pricingData.aiLabel}
RECURSOS ATIVOS: ${pricingData.activeFeaturesList.join(", ") || "Nenhum adicional"}
PLANO DE SUPORTE: ${pricingData.supportLabel}

TEMPO ESTIMADO: ${pricingData.totalWeeks} semanas
INVESTIMENTO ESTIMADO: R$ ${pricingData.totalSetupMin.toLocaleString("pt-BR")} a R$ ${pricingData.totalSetupMax.toLocaleString("pt-BR")}
MENSALIDADE INFRA/SUPORTE: R$ ${pricingData.totalMonthly.toLocaleString("pt-BR")}/mês
PLANO RECOMENDADO: ${pricingData.tierName}
    `.trim();

    const newDeal = {
      id: leadId,
      cliente: nome,
      contatoEmail: email,
      contatoTelefone: whatsapp,
      titulo: `Simulador KN: ${pricingData.tierName}`,
      valor: pricingData.totalSetupMin,
      etapa: "prospect",
      prioridade: "alta",
      canal: "Simulador de Sistemas",
      observacoes: detalhes 
        ? `Mensagem do cliente: ${detalhes}\n\n--- Configurações Simuladas ---\n${simulatedPlanDetails}`
        : `Simulação de orçamento enviada pelo site.\n\n--- Configurações Simuladas ---\n${simulatedPlanDetails}`,
      dataCriacao: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage for instant CRM pipeline sync
    try {
      const localSaved = localStorage.getItem("korenexus_funil_deals");
      let currentDeals = [];
      if (localSaved) {
        currentDeals = JSON.parse(localSaved);
      }
      currentDeals.unshift(newDeal);
      localStorage.setItem("korenexus_funil_deals", JSON.stringify(currentDeals));
    } catch (err) {
      console.warn("localStorage sync failed:", err);
    }

    // Save to Firestore deals collection
    try {
      await setDoc(doc(firestoreDb, "deals", leadId), newDeal);
      console.log("Simulated deal saved to Firestore.");
    } catch (err) {
      console.warn("Could not sync deal to Firestore:", err);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 text-left">
      {/* Header section with clean display typography */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-400 rounded-full uppercase tracking-wider">
              Simulador Inteligente v2.4
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">
            Calculadora de Orçamento & Escopo
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Monte a especificação do seu software sob medida, aplicativo móvel ou site em Jundiaí e região. 
            Nosso algoritmo estima instantaneamente o investimento ideal, prazo e infraestrutura recomendada.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Calculator className="h-4 w-4 text-blue-400" />
          <span>Atendimento Local em Jundiaí e Região Paulista</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel - Left column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: CLIENT PROFILE */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-white font-sans">Qual o perfil do contratante / projeto?</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "cpf",
                  title: "Pessoa Física / CPF",
                  desc: "Autônomos, estudantes ou criadores independentes. Projetos enxutos e custos de infraestrutura otimizados.",
                  badge: "70% OFF Ativo",
                  icon: <User className="h-4 w-4 text-cyan-400" />
                },
                {
                  id: "pme",
                  title: "PME / MEI / Startup",
                  desc: "Pequenos/médios negócios, comércio local ou startups. Foco em custo-benefício e MVP rápido.",
                  badge: "45% OFF Ativo",
                  icon: <Building className="h-4 w-4 text-emerald-400" />
                },
                {
                  id: "enterprise",
                  title: "Corporativo / CNPJ",
                  desc: "Médias e grandes empresas. Exige SLA estrito, contratos formais de sigilo (NDA) e alta disponibilidade.",
                  badge: "Valor Enterprise",
                  icon: <Shield className="h-4 w-4 text-amber-400" />
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setClientProfile(item.id as ClientProfileType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all flex flex-col justify-between h-full group ${
                    clientProfile === item.id 
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white" 
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-900 group-hover:border-slate-800">
                      {item.icon}
                    </div>
                    {clientProfile === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded ${
                      clientProfile === item.id ? "bg-blue-500/10 text-blue-400" : "bg-slate-950 text-slate-500"
                    } font-bold mb-1.5 inline-block`}>
                      {item.badge}
                    </span>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* STEP 2: SERVICE TYPE */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-white font-sans">Qual o tipo de solução digital que você precisa?</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "web-app",
                  title: "Sistema ERP / CRM / Web App",
                  desc: "Sistemas corporativos customizados para automatizar fluxos de gestão interna, estoque, vendas e controle de faturamento.",
                  icon: <Layers className="h-4 w-4 text-emerald-400" />
                },
                {
                  id: "mobile-app",
                  title: "Aplicativo Mobile",
                  desc: "Apps de alta performance nativos ou híbridos para iOS e Android. Ideal para equipes externas ou interação com clientes.",
                  icon: <Smartphone className="h-4 w-4 text-purple-400" />
                },
                {
                  id: "web-site",
                  title: "Site Institucional ou Portal",
                  desc: "Páginas otimizadas para conversão SEO local, portais de notícias ou blogs corporativos com alta pontuação de PageSpeed.",
                  icon: <Zap className="h-4 w-4 text-cyan-400" />
                },
                {
                  id: "custom-service",
                  title: "Automações & APIs",
                  desc: "Modelagem de microsserviços rápidos, integração entre sistemas legados, robôs RPA ou robótica automatizada.",
                  icon: <Cpu className="h-4 w-4 text-amber-400" />
                }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setService(item.id as ServiceType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all flex flex-col justify-between h-full group ${
                    service === item.id 
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white" 
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-900 group-hover:border-slate-800">
                      {item.icon}
                    </div>
                    {service === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: SCALE / SIZE OF PROJECT */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">3</span>
              <h3 className="text-base font-bold text-white font-sans">Qual a escala/porte estimada do seu sistema?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "small",
                  title: "Pequeno (MVP Enxuto)",
                  desc: "Ideal para testar mercado de forma rápida. Fluxos principais com até 5 telas essenciais.",
                  badge: "Rápido & Focado"
                },
                {
                  id: "medium",
                  title: "Médio (Corporativo)",
                  desc: "Ideal para empresas consolidadas. Múltiplos departamentos, até 15 telas e relatórios estruturados.",
                  badge: "Mais Procurado"
                },
                {
                  id: "large",
                  title: "Grande (Enterprise)",
                  desc: "Solução completa de alto desempenho. Telas ilimitadas, altíssima customização de dados e segurança reforçada.",
                  badge: "Escalável"
                }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setScale(item.id as ScaleType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all h-full flex flex-col justify-between ${
                    scale === item.id
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white"
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${
                      scale === item.id 
                        ? "bg-blue-500/10 border-blue-500/25 text-blue-400" 
                        : "bg-slate-950 border-slate-900 text-slate-500"
                    } font-mono font-bold`}>
                      {item.badge}
                    </span>
                    {scale === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: DATABASE DESIGN & INFRASTRUCTURE */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">4</span>
                <h3 className="text-base font-bold text-white font-sans">Como será gerenciado o Banco de Dados?</h3>
              </div>
              <Database className="h-4 w-4 text-blue-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "none",
                  title: "Sem Banco Dedicado",
                  desc: "Ideal para sites puramente informativos ou sistemas que apenas consomem APIs externas estáticas.",
                  extra: "+ R$ 0"
                },
                {
                  id: "client",
                  title: "Banco do Cliente",
                  desc: "Integramos e estruturamos túneis seguros (SSH/VPN) com seu banco atual (PostgreSQL, Oracle, SQL Server, etc).",
                  extra: "+ R$ 0"
                },
                {
                  id: "korenexus",
                  title: "Hospedado na Nuvem KN",
                  desc: "Banco dedicado (Firestore/Postgres) com replicação, backup diário automático e alta redundância.",
                  extra: `+ R$ ${dbUsage === "low" ? 30 : dbUsage === "medium" ? 60 : 90} setup • R$ ${
                    clientProfile === "cpf" 
                      ? (dbUsage === "low" ? 9 : dbUsage === "medium" ? 19 : 39)
                      : clientProfile === "pme"
                      ? (dbUsage === "low" ? 12 : dbUsage === "medium" ? 24 : 49)
                      : (dbUsage === "low" ? 15 : dbUsage === "medium" ? 29 : 59)
                  }/mês`
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setDatabase(item.id as DatabaseType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all h-full flex flex-col justify-between ${
                    database === item.id
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white"
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      database === item.id 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                        : "bg-slate-950 border-slate-900 text-slate-500"
                    } font-mono font-bold`}>
                      {item.extra}
                    </span>
                    {database === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {database !== "none" && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-900 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">Quantidade de Uso / Volume do Banco</h4>
                    <p className="text-[10px] text-slate-400 font-sans">Selecione a estimativa de tráfego de dados mensal.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#07090f] p-1 border border-slate-900 rounded-lg">
                    {[
                      { id: "low", label: "Baixo (Até 10k requisições/mês)" },
                      { id: "medium", label: "Médio (Até 250k requisições/mês)" },
                      { id: "high", label: "Alto (Escala Ilimitada)" }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => { setDbUsage(tier.id as "low" | "medium" | "high"); playBeep(); }}
                        className={`px-3 py-1 text-[10px] font-sans font-medium rounded transition-all ${
                          dbUsage === tier.id
                            ? "bg-blue-500 text-black font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {tier.id === "low" ? "Baixo" : tier.id === "medium" ? "Médio" : "Alto"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 5: APIs & INTEGRETIONS */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">5</span>
                <h3 className="text-base font-bold text-white font-sans">Qual o nível de integração de APIs de terceiros?</h3>
              </div>
              <Cpu className="h-4 w-4 text-blue-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "none",
                  title: "Nenhuma API externa",
                  desc: "Fluxos autônomos sem requisições externas para sistemas de terceiros.",
                  extra: "+ R$ 0"
                },
                {
                  id: "standard",
                  title: "APIs Padrão",
                  desc: "Até 3 integrações simplificadas: gateways de pagamento (Stripe/Asaas), busca de CEP, login social, etc.",
                  extra: "Sob Demanda • Por Uso"
                },
                {
                  id: "complex",
                  title: "Complexo / Legados",
                  desc: "Mais de 3 conexões, ERPs legados fechados, web scrapers complexos ou conexões com dados governamentais.",
                  extra: "Sob Demanda • Por Uso"
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setApi(item.id as ApiIntegrationType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all h-full flex flex-col justify-between ${
                    api === item.id
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white"
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      api === item.id 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                        : "bg-slate-950 border-slate-900 text-slate-500"
                    } font-mono font-bold`}>
                      {item.extra}
                    </span>
                    {api === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {api !== "none" && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-900 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">Frequência de Chamadas / Uso de API</h4>
                    <p className="text-[10px] text-slate-400 font-sans">Selecione o volume estimado de chamadas externas de API mensais.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#07090f] p-1 border border-slate-900 rounded-lg">
                    {[
                      { id: "low", label: "Baixo (Até 5k ch./mês)" },
                      { id: "medium", label: "Médio (Até 50k ch./mês)" },
                      { id: "high", label: "Alto (Corporativo)" }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => { setApiUsage(tier.id as "low" | "medium" | "high"); playBeep(); }}
                        className={`px-3 py-1 text-[10px] font-sans font-medium rounded transition-all ${
                          apiUsage === tier.id
                            ? "bg-blue-500 text-black font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {tier.id === "low" ? "Baixo" : tier.id === "medium" ? "Médio" : "Alto"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 6: AI & GEMINI CAPABILITIES */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">6</span>
                <h3 className="text-base font-bold text-white font-sans">Deseja integrar Inteligência Artificial (ex: Gemini)?</h3>
              </div>
              <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "none",
                  title: "Sem I.A. no momento",
                  desc: "Regras de negócio tradicionais baseadas em programação estruturada padrão.",
                  extra: "Sem taxa extra"
                },
                {
                  id: "basic",
                  title: "I.A. Assistiva Básica",
                  desc: "Resumo automático de documentos, geração inteligente de e-mails/posts, análise de sentimentos.",
                  extra: "Sob Demanda • Por Uso"
                },
                {
                  id: "advanced",
                  title: "Agentes de I.A. & RAG",
                  desc: "RAG customizado para ler seus manuais PDF, chatbots autônomos integrados ao WhatsApp, IA Multi-modal.",
                  extra: "Sob Demanda • Por Uso"
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setAi(item.id as AiIntegrationType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all h-full flex flex-col justify-between ${
                    ai === item.id
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white"
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      ai === item.id 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                        : "bg-slate-950 border-slate-900 text-slate-500"
                    } font-mono font-bold`}>
                      {item.extra}
                    </span>
                    {ai === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 7: ADDITIONAL ARCHITECTURE FEATURES */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">7</span>
              <h3 className="text-base font-bold text-white font-sans">Selecione recursos de arquitetura adicionais:</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: "auth",
                  title: "Módulo de Acessos & Perfis (SSO)",
                  desc: "Controle de login (Google/Email), múltiplos perfis de permissão de usuário (Admin, Operador, Cliente).",
                  priceText: "Incluso"
                },
                {
                  key: "notifications",
                  title: "Notificações Tempo Real / Push",
                  desc: "Avisos por WhatsApp, e-mail ou pop-up nativo no navegador do cliente.",
                  priceText: "Incluso"
                },
                {
                  key: "realtime",
                  title: "Sincronização & Colaboração Live",
                  desc: "Atualização instantânea na tela sem refresh (ideal para dashboards, chats e editores compartilhados).",
                  priceText: "Incluso"
                },
                {
                  key: "offline",
                  title: "Tecnologia Offline-First / PWA",
                  desc: "O sistema funciona e armazena dados mesmo sem sinal de internet, sincronizando tudo ao reconectar.",
                  priceText: "Incluso"
                },
                {
                  key: "saas",
                  title: "Arquitetura Multi-Tenant SaaS",
                  desc: "Ideal se você planeja vender o sistema: separação lógica isolada de dados por assinante/inquilino.",
                  priceText: "Incluso"
                }
              ].map((item) => {
                const isActive = features[item.key as keyof AdditionalFeatures];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => { handleFeatureToggle(item.key as keyof AdditionalFeatures); playBeep(); }}
                    className={`p-4 text-left rounded-xl border transition-all flex items-start gap-3 h-full ${
                      isActive
                        ? "bg-slate-900/40 border-blue-500/40 text-white"
                        : "bg-[#07090f] border-slate-900 text-slate-400 hover:border-slate-850"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isActive 
                        ? "bg-blue-500 border-blue-500 text-black" 
                        : "border-slate-800 bg-slate-950"
                    }`}>
                      {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-white font-sans">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                      <span className="inline-block text-[9px] font-mono text-blue-400 font-bold bg-blue-500/5 px-1 rounded border border-blue-500/10 mt-1.5">
                        {item.priceText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 8: SUPPORT PLAN */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 w-5 h-5 rounded-full flex items-center justify-center">8</span>
                <h3 className="text-base font-bold text-white font-sans">Selecione o plano de Suporte & Manutenção:</h3>
              </div>
              <Wrench className="h-4 w-4 text-blue-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "standard",
                  title: "Suporte Padrão (9/5)",
                  desc: "Ideal para rotinas normais. Atendimento telefônico e e-mail de segunda a sexta, em horário comercial.",
                  monthly: `R$ ${clientProfile === "cpf" ? 9 : clientProfile === "pme" ? 15 : 19}/mês`
                },
                {
                  id: "premium",
                  title: "Premium SLA (24/7)",
                  desc: "Monitoramento contínuo de erros 24 horas. Resolução de bugs críticos em até 4 horas com plantão ativo.",
                  monthly: `R$ ${clientProfile === "cpf" ? 29 : clientProfile === "pme" ? 39 : 49}/mês`
                },
                {
                  id: "enterprise",
                  title: "Enterprise Dedicado",
                  desc: "Acesso direto a engenheiro de software dedicado, auditoria mensal de core-speed e servidores prioritários.",
                  monthly: `R$ ${clientProfile === "cpf" ? 59 : clientProfile === "pme" ? 79 : 99}/mês`
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setSupport(item.id as SupportPlanType); playBeep(); }}
                  className={`p-4 text-left rounded-xl border transition-all h-full flex flex-col justify-between ${
                    support === item.id
                      ? "bg-slate-900/60 border-blue-500/55 shadow-[0_0_12px_rgba(59,130,246,0.1)] text-white"
                      : "bg-[#07090f] border-slate-900 text-slate-300 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      support === item.id 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                        : "bg-slate-950 border-slate-900 text-slate-500"
                    } font-mono font-bold`}>
                      {item.monthly}
                    </span>
                    {support === item.id && (
                      <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-black font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Estimation Results and Blueprint - Right column */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {/* BUDGET SUMMARY CARD */}
          <div className="bg-slate-950 border border-blue-500/20 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-2xl">
            {/* Holographic scanner laser glow */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[pulse_2s_infinite]"></div>
            <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Nível Recomendado</span>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white font-mono">{pricingData.tierName}</h4>
                  <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                </div>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/15 text-[9px] font-mono font-bold text-blue-400 rounded uppercase">
                Pré-Orçamento
              </span>
            </div>

            {/* Glowing Big Pricing Numbers */}
            <div className="space-y-3.5 bg-[#07090f] border border-slate-900 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Investimento Estimado de Desenvolvimento:</span>
                <div className="flex items-baseline gap-1.5 text-white">
                  <span className="text-xs font-sans text-slate-400">R$</span>
                  <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-white">
                    {pricingData.totalSetupMin.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-sans text-slate-500">a</span>
                  <span className="text-xs font-sans text-slate-400">R$</span>
                  <span className="text-sm font-sans font-bold text-slate-300">
                    {pricingData.totalSetupMax.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Manutenção & Infraestrutura:</span>
                  <div className="flex items-baseline gap-1 text-blue-400">
                    <span className="text-[10.5px] font-sans">R$</span>
                    <span className="text-lg font-mono font-bold">
                      {pricingData.totalMonthly.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[9.5px] font-sans text-slate-500">/mês</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Tempo de Entrega:</span>
                  <div className="flex items-center gap-1.5 justify-end text-slate-300 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs font-mono font-bold">~ {pricingData.totalWeeks} semanas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC SYSTEM ARCHITECTURE BLUEPRINT GRAPHICS */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Arquitetura Estrutural Simulada:</span>
              <div className="border border-slate-900 bg-[#06080e] rounded-xl p-3 text-center text-slate-400 text-xs font-mono relative overflow-hidden space-y-3 min-h-[160px] flex flex-col justify-between">
                
                {/* Horizontal flow line logic diagram */}
                <div className="flex items-center justify-between px-2 pt-2 relative z-10">
                  
                  {/* Client UI Component */}
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center gap-1 w-20 shadow">
                    <Smartphone className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-[8.5px] font-bold text-white uppercase">Client UI</span>
                    <span className="text-[7.5px] text-slate-500">Web/Mobile</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex-1 flex flex-col items-center relative mx-1">
                    <span className="text-[7px] text-slate-600 mb-0.5 animate-pulse">HTTPS API</span>
                    <div className="w-full h-[1px] bg-blue-500/30 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 border-t border-r border-blue-400 rotate-45"></div>
                    </div>
                  </div>

                  {/* Core App Backend */}
                  <div className="p-2 rounded-lg bg-slate-950 border border-blue-500/25 flex flex-col items-center gap-1 w-20 shadow-[0_0_8px_rgba(59,130,246,0.15)]">
                    <Cpu className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-[8.5px] font-bold text-emerald-400 uppercase">Kore Core</span>
                    <span className="text-[7.5px] text-slate-500">Node/TS Engine</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex-1 flex flex-col items-center relative mx-1">
                    <span className="text-[7px] text-slate-600 mb-0.5">Database</span>
                    <div className="w-full h-[1px] bg-blue-500/30 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 border-t border-r border-blue-400 rotate-45"></div>
                    </div>
                  </div>

                  {/* Database Node */}
                  <div className={`p-2 rounded-lg bg-slate-950 border transition-all flex flex-col items-center gap-1 w-20 shadow ${
                    database !== "none" ? "border-amber-500/30" : "border-slate-850 opacity-40"
                  }`}>
                    <Database className={`h-3.5 w-3.5 ${database !== "none" ? "text-amber-400" : "text-slate-600"}`} />
                    <span className="text-[8.5px] font-bold text-white uppercase">Data Store</span>
                    <span className="text-[7.5px] text-slate-500">
                      {database === "none" ? "None" : database === "client" ? "Tunnel SQL" : "Cloud NoSQL"}
                    </span>
                  </div>

                </div>

                {/* Sub components connection based on features */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-900/60 pt-3 text-[8px] text-left">
                  <div className="p-1.5 rounded bg-[#0b0e17] border border-slate-900 space-y-0.5">
                    <span className="text-slate-500 block uppercase font-bold">API Integration</span>
                    <span className="text-slate-300 block truncate">
                      {api === "none" ? "None" : api === "standard" ? "3 Integrations" : "Legacy Hub"}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-[#0b0e17] border border-slate-900 space-y-0.5">
                    <span className="text-slate-500 block uppercase font-bold">Core Security</span>
                    <span className="text-slate-300 block">
                      {features.auth ? "SSO Active" : "Basic SSL Only"}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-[#0b0e17] border border-slate-900 space-y-0.5">
                    <span className="text-slate-500 block uppercase font-bold">AI Autopilot</span>
                    <span className="text-slate-300 block truncate">
                      {ai === "none" ? "Inactive" : ai === "basic" ? "Gemini Text" : "Full Agentic RAG"}
                    </span>
                  </div>
                </div>

                {/* Technical stats watermark */}
                <div className="flex items-center justify-between text-[7.5px] text-slate-600 font-mono pt-1">
                  <span>SSL: ACTIVE (TLS 1.3)</span>
                  <span>HOSTING: CLOUD RUN COREGUARD</span>
                  <span>REGION: SOUTHAMERICA-EAST1</span>
                </div>
              </div>
            </div>

            {/* ITEMIZED BREAKDOWN LIST */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Itens Inclusos no Projeto:</span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {[
                  { label: `Serviço Base: ${pricingData.serviceLabel}`, checked: true },
                  { label: `Escala: ${pricingData.scaleLabel}`, checked: true },
                  database !== "none" ? { label: `Banco: ${pricingData.dbLabel}`, checked: true } : null,
                  api !== "none" ? { label: `APIs: ${pricingData.apiLabel}`, checked: true } : null,
                  ai !== "none" ? { label: `Inteligência Artificial: ${pricingData.aiLabel}`, checked: true } : null,
                  ...pricingData.activeFeaturesList.map(feat => ({ label: `Recurso: ${feat}`, checked: true })),
                  { label: `SLA: ${pricingData.supportLabel}`, checked: true },
                  { label: "Otimização Crítica de Core-speed (FCP/LCP < 2s)", checked: true },
                  { label: "Hospedagem em container Docker escalável de alta velocidade", checked: true },
                  { label: "Código-fonte 100% autoral entregue ao cliente", checked: true },
                ].filter(Boolean).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                    <span className="font-sans text-slate-350">{item?.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* PROPOSAL REQUEST FORM */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-sans">Solicitar Orçamento Formal</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  Insira seus dados para consolidar a simulação e receber uma proposta técnica oficial em PDF por WhatsApp.
                </p>
              </div>
              <Send className="h-4 w-4 text-blue-400" />
            </div>

            {validationError && (
              <div className="p-3 bg-red-950/25 border border-red-900/30 text-red-400 rounded-xl text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-3 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto">
                  <Check className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Solicitação Enviada!</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                    Olá <strong>{nome}</strong>! Sua simulação do plano <strong>{pricingData.tierName}</strong> foi cadastrada com sucesso. 
                    Nossa equipe de engenharia em Jundiaí entrará em contato em até 2 horas por WhatsApp.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setNome("");
                    setEmail("");
                    setWhatsapp("");
                    setDetalhes("");
                  }}
                  className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/15 rounded text-[10px] font-mono text-blue-400 transition"
                >
                  Nova Simulação
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">Seu Nome *</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João da Silva"
                    required
                    className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500/50 rounded-xl p-3 text-white outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">E-mail Corporativo *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: joao@empresa.com.br"
                      required
                      className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500/50 rounded-xl p-3 text-white outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">WhatsApp / Celular *</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ex: (11) 99999-9999"
                      required
                      className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500/50 rounded-xl p-3 text-white outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">Observações do Escopo (Opcional)</label>
                  <textarea
                    rows={2}
                    value={detalhes}
                    onChange={(e) => setDetalhes(e.target.value)}
                    placeholder="Descreva brevemente sua ideia ou necessidades especiais..."
                    className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500/50 rounded-xl p-3 text-white outline-none font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans font-bold rounded-xl transition shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processando Configurações...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      <span>Agendar Reunião Técnica & Gerar PDF</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
