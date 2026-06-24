import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Smartphone, 
  Play, 
  Code, 
  CheckCircle, 
  RefreshCw, 
  BarChart2, 
  Zap, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Download, 
  FileJson, 
  AlertCircle, 
  Share2, 
  Copy, 
  Globe, 
  Cpu, 
  Users, 
  Eye, 
  Check, 
  FileText, 
  Sliders, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ShoppingBag,
  HelpCircle,
  Clock,
  Instagram,
  Linkedin,
  FileSpreadsheet,
  Mail,
  Workflow,
  ArrowRightLeft,
  DollarSign,
  FileDown,
  FileCheck,
  Database,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface CacheEntry {
  id: string;
  type: "chatbot" | "conteudo" | "automacao" | "saas" | "agentes";
  query: string;
  response: string;
  categoryInfo?: string;
  createdAt: string;
}

const DEFAULT_DB_ENTRIES: CacheEntry[] = [
  {
    id: "db-1",
    type: "chatbot",
    query: "preço",
    response: "A KoreNexus cria chatbots sob medida. Nossos valores variam de R$ 300 para fluxos automatizados simples a R$ 2.000 para soluções corporativas avançadas de WhatsApp integradas a banco de dados.",
    categoryInfo: "Suporte Comercial",
    createdAt: "22/06/2026 14:00"
  },
  {
    id: "db-2",
    type: "chatbot",
    query: "contato",
    response: "Você pode falar com nossos especialistas da KoreNexus enviando e-mail para contato@korenexus.com.br ou ligando para o nosso suporte corporativo.",
    categoryInfo: "Atendimento N1",
    createdAt: "22/06/2026 14:15"
  },
  {
    id: "db-3",
    type: "conteudo",
    query: "wms logistica",
    response: "📦 REVOLUCIONE SUA LOGÍSTICA! O WMS integrado KoreNexus otimiza o fluxo de cargas de ponta a ponta com separação inteligente. Adeus falhas de picking e prejuízos operacionais!",
    categoryInfo: "linkedin (vendedor)",
    createdAt: "22/06/2026 14:30"
  },
  {
    id: "db-4",
    type: "saas",
    query: "resumo do faturamento anual",
    response: "📄 O relatório aponta crescimento de 18% ao ano sob implantação das ferramentas de automação KoreNexus. O fluxo operacional e faturamento mantiveram estabilidade total.",
    categoryInfo: "SaaS (resumidor)",
    createdAt: "22/06/2026 14:45"
  }
];

interface BotTemplate {
  id: string;
  name: string;
  platform: "whatsapp" | "web" | "telegram" | "app";
  description: string;
  avatarColor: string;
  greeting: string;
  prompt: string;
  keywords: { trigger: string; reply: string }[];
}

const INITIAL_BOTS: BotTemplate[] = [
  {
    id: "tpl-1",
    name: "Suporte Técnico Internet",
    platform: "whatsapp",
    description: "Template otimizado para provedores de internet (ISPs), diagnóstico de conexão, reboot de modems e suporte N1.",
    avatarColor: "bg-indigo-500",
    greeting: "Olá! Seja bem-vindo ao suporte automatizado da KoreLink. 🌐\nPor favor, digite seu CPF ou escolha uma das opções abaixo:\n\n1. Lentidão ou Sem Conexão 📶\n2. Segunda Via de Boleto 🧾\n3. Alterar Plano de Internet 🚀\n4. Falar com Suporte Humano 👤",
    prompt: "Você é o assistente virtual de um provedor de internet de alta velocidade super experiente. Ajude o cliente a reiniciar o modem (tirar da tomada por 30s), verificar cabos coaxiais ou ópticos, ou responder cordial para falar com humanos se nenhuma opção resolver.",
    keywords: [
      { trigger: "1", reply: "Entendo o problema. Na maioria das vezes, desligar o modem da energia elétrica por 30 segundos e ligá-lo novamente resolve problemas de lentidão. Pode fazer este teste agora mesmo? Se persistir, farei um reset remoto." },
      { trigger: "lentidao", reply: "Para problemas de lentidão, certifique-se de que não está baixando arquivos pesados e faça um teste preferencialmente conectado via cabo de rede diretamente ao roteador." },
      { trigger: "2", reply: "Perfeito! Para emitirmos sua segunda via, por favor digite o CPF do titular da conta para localizarmos suas faturas em aberto em nosso sistema." },
      { trigger: "3", reply: "Excelente escolha! Atualmente temos planos promocionais incríveis para sua região, incluindo 500 Mega por apenas R$ 99,90/mês. Gostaria de agendar a migração de pacote?" },
      { trigger: "4", reply: "Estou transferindo você para um analista humano do time de infraestrutura. Aguarde um instante por favor... ⏳" }
    ]
  },
  {
    id: "tpl-2",
    name: "Atendimento Clínico & Agendamentos",
    platform: "whatsapp",
    description: "Ideal para clínicas, consultórios médicos e de estética. Agendamentos de consultas automáticas, confirmação de horários.",
    avatarColor: "bg-teal-500",
    greeting: "Olá, bem-vindo à Clínica Saúde Integrada! 🏥✨\nComo posso cuidar de você hoje?\n\n1. Agendar uma Nova Consulta / Retorno 📅\n2. Horários Disponíveis e Convênios 🧬\n3. Endereço da Clínica 📍\n4. Cancelar Atendimento ❌",
    prompt: "Você é um atendente de clínica médica extremamente simpático e paciente. Oriente os pacientes sobre médicos disponíveis (Dr. Marcos - Cardiologia, Dra. Ana - Pediatria).",
    keywords: [
      { trigger: "1", reply: "Para agendar, me diga: qual é a especialidade ou o nome do médico que você está procurando? Temos Clínica Geral, Cardiologia, Pediatria e Dermatologia ativo esta semana." },
      { trigger: "2", reply: "Aceitamos os principais convênios do país: Unimed, Amil, SulAmérica, Bradesco Saúde e Cassi. Para consultas particulares, emitimos recibo completo para reembolso." },
      { trigger: "3", reply: "Nossa matriz fica localizada na Av. Paulista, 1200 - Edifício Corporate Center. Temos estacionamento conveniado com manobrista no local! 🚗 Office 1402." }
    ]
  }
];

export default function ChatbotsPage() {
  const [activeSubjectTab, setActiveSubjectTab] = useState<"whatsapp" | "conteudo" | "automacao" | "saas" | "agentes" | "database">("whatsapp");
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({ show: false, msg: "", type: "success" });

  const [dbEntries, setDbEntries] = useState<CacheEntry[]>(() => {
    const saved = localStorage.getItem("korenexus_db_cache");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DB_ENTRIES;
      }
    }
    return DEFAULT_DB_ENTRIES;
  });

  const saveEntriesToLocalStorage = (newEntries: CacheEntry[]) => {
    setDbEntries(newEntries);
    localStorage.setItem("korenexus_db_cache", JSON.stringify(newEntries));
  };

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const copyToClipboard = (text: string, label: string = "Sucesso") => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copiado: ${label}!`);
  };

  // State variables for Database / Cache tab
  const [newDbQuery, setNewDbQuery] = useState("");
  const [newDbResponse, setNewDbResponse] = useState("");
  const [newDbType, setNewDbType] = useState<"chatbot" | "conteudo" | "automacao" | "saas" | "agentes">("chatbot");
  const [dbSearchFilter, setDbSearchFilter] = useState("");

  // ----------------------------------------------------
  // TOPIC 1: CHATBOTS WHATSAPP & WEB
  // ----------------------------------------------------
  const [bots, setBots] = useState<BotTemplate[]>(INITIAL_BOTS);
  const [selectedBotId, setSelectedBotId] = useState<string>("tpl-1");
  const [botName, setBotName] = useState(INITIAL_BOTS[0].name);
  const [botPlatform, setBotPlatform] = useState(INITIAL_BOTS[0].platform);
  const [botGreeting, setBotGreeting] = useState(INITIAL_BOTS[0].greeting);
  const [botPrompt, setBotPrompt] = useState(INITIAL_BOTS[0].prompt);
  const [botKeywords, setBotKeywords] = useState<{ trigger: string; reply: string }[]>(INITIAL_BOTS[0].keywords);
  
  const currentBot = useMemo(() => bots.find(b => b.id === selectedBotId) || bots[0], [bots, selectedBotId]);

  useEffect(() => {
    setBotName(currentBot.name);
    setBotPlatform(currentBot.platform);
    setBotGreeting(currentBot.greeting);
    setBotPrompt(currentBot.prompt);
    setBotKeywords(currentBot.keywords);
    setChatHistory([
      { role: "assistant", content: currentBot.greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [selectedBotId, currentBot]);

  const [chatHistory, setChatHistory] = useState<{ role: "assistant" | "user"; content: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { role: "user", content: userMsg, time: userTime }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let r = "";
      const cleaned = userMsg.toLowerCase().trim();

      // 1. FIRST check the Database / Cache to avoid querying AI or repeated questions/texts!
      const cached = dbEntries.find(entry => 
        entry.type === "chatbot" && 
        (cleaned.includes(entry.query.toLowerCase()) || entry.query.toLowerCase().includes(cleaned))
      );

      if (cached) {
        r = `⚡ [Banco de Dados KoreNexus / Sem uso de IA]:\n${cached.response}`;
        triggerToast("Resposta lida do banco para evitar IA duplicada! ⚡");
      } else {
        // Fallback to keywords
        for (const item of botKeywords) {
          if (cleaned.includes(item.trigger.toLowerCase())) {
            r = item.reply;
            break;
          }
        }
        if (!r) {
          r = `Recebido! Minha inteligência artificial como "${botName}" interpretou sua solicitação. Estarei executando a diretriz de prompt:\n\n*${botPrompt}*`;
        }

        // 2. Automatically save new interaction to the database
        const newEntry: CacheEntry = {
          id: `db-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: "chatbot",
          query: cleaned,
          response: r,
          categoryInfo: "Atendimento Inteligente",
          createdAt: new Date().toLocaleString()
        };
        saveEntriesToLocalStorage([newEntry, ...dbEntries]);
        triggerToast("Nova resposta salva no Banco de Dados! 💾");
      }

      setIsTyping(false);
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: r,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  // WhatsApp Estimator Calculator
  const [hasIntegration, setHasIntegration] = useState(true);
  const [dbSync, setDbSync] = useState(false);
  const [aiAdvanced, setAiAdvanced] = useState(true);
  const [whatsProjectPrice, setWhatsProjectPrice] = useState(1200);

  useEffect(() => {
    let base = 500;
    if (hasIntegration) base += 400;
    if (dbSync) base += 500;
    if (aiAdvanced) base += 600;
    setWhatsProjectPrice(base);
  }, [hasIntegration, dbSync, aiAdvanced]);

  // ----------------------------------------------------
  // TOPIC 2: GERAÇÃO DE CONTEÚDO COM IA
  // ----------------------------------------------------
  const [contentTopic, setContentTopic] = useState("");
  const [contentPlatform, setContentPlatform] = useState<"instagram" | "linkedin" | "blog">("instagram");
  const [contentTone, setContentTone] = useState<"vendedor" | "tecnico" | "descontraido">("vendedor");
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);

  const [monthlySubsEstimate, setMonthlySubsEstimate] = useState(350);
  const [frequency, setFrequency] = useState("12_posts");

  useEffect(() => {
    let price = 250;
    if (frequency === "24_posts") price = 450;
    if (frequency === "30_posts") price = 600;
    if (contentPlatform === "blog") price += 100;
    setMonthlySubsEstimate(price);
  }, [frequency, contentPlatform]);

  const handleGenerateContent = () => {
    if (!contentTopic.trim()) {
      triggerToast("Por favor, digite um tema/produto para gerar!", "error");
      return;
    }
    setGeneratingContent(true);
    setGeneratedOutput("");

    // 1. FIRST check the Database / Cache to avoid repeated IA generations
    const cleaned = contentTopic.toLowerCase().trim();
    const cached = dbEntries.find(entry => 
      entry.type === "conteudo" && 
      (entry.query.toLowerCase().trim() === cleaned)
    );

    if (cached) {
      setTimeout(() => {
        setGeneratedOutput(cached.response);
        setGeneratingContent(false);
        triggerToast("Copiado instantaneamente do Banco de Dados! (Evitou IA duplicada) ⚡");
      }, 500);
      return;
    }

    setTimeout(() => {
      let outputText = "";
      if (contentPlatform === "instagram") {
        outputText = `🚀 ATENÇÃO EMPREENDEDORES! Você sabia que ${contentTopic} pode triplicar sua produtividade hoje? ✨\n\nCriado com o ecossistema tecnológico inovador da KoreNexus, integramos soluções ágeis para automatizar processos lentos da sua operação.\n\n💡 Chega de perder tempo precioso com retrabalho ou planilhas confusas. Descubra os recursos sob medida para seu negócio!\n\n👉 Clique no link da bio e fale com um especialista da KoreNexus para agendarmos sua demonstração dinâmica gratuita.\n\n#KoreNexus #Tecnologia #Startups #Inovacao #InteligenciaArtificial #Produtividade`;
      } else if (contentPlatform === "linkedin") {
        outputText = `Como a automação estratégica impacta o retorno sobre investimento (ROI) em projetos de ${contentTopic}?\n\nNo cenário corporativo competitivo de 2026, otimizar fluxos operacionais não é mais opcional — tornou-se o diferencial crucial para a sustentabilidade. Na KoreNexus, fornecemos arquiteturas orientadas por IA que integram dados legados com microsserviços modernos na nuvem.\n\nNossos estudos mostram reduções de até 65% em gargalos operacionais após a consolidação de dados distribuídos.\n\nQual é o nível de maturidade da automação de processos na sua empresa atualmente? Debata comigo nos comentários. 👇\n\n#BusinessAutomation #SistemasCorporativos #KoreNexusTech #CloudArchitecture`;
      } else {
        outputText = `### O Guia Completo para Implementar ${contentTopic} na sua Empresa\n\nNo dinâmico mercado atual de tecnologia, a busca por agilidade impulsiona grandes corporações a buscarem sistemas inteligentes. Mas qual o primeiro passo prático?\n\n#### 1. Identificação de Gargalos\nAntes de aplicar IA ou automações, analise todos os processos repetitivos e cataloge cada operation rotineira de infraestrutura técnica.\n\n#### 2. Desenvolvendo Soluções Integradas\nA KoreNexus cria softwares personalizados para canais abertos, incluindo ERPs com portarias dinâmicas, logs inteligentes e sistemas robustos de WMS logístico.\n\n#### 3. Conclusão e Próximos Passos\nAdotar tecnologia inteligente não precisa ser doloroso ou lento. Fale com um desenvolvedor da KoreNexus hoje e revolucione sua infraestrutura corporativa!`;
      }

      // 2. Automatically save new interaction to the database
      const newEntry: CacheEntry = {
        id: `db-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "conteudo",
        query: cleaned,
        response: outputText,
        categoryInfo: `${contentPlatform} (${contentTone})`,
        createdAt: new Date().toLocaleString()
      };
      saveEntriesToLocalStorage([newEntry, ...dbEntries]);

      setGeneratedOutput(outputText);
      setGeneratingContent(false);
      triggerToast("Conteúdo gerado e SALVO no Banco de Dados! 💾");
    }, 1800);
  };

  // ----------------------------------------------------
  // TOPIC 3: AUTOMAÇÕES COM IA
  // ----------------------------------------------------
  // Simulates custom flow creator (n8n/Make style)
  const [flowSteps, setFlowSteps] = useState<{ id: string; name: string; type: "trigger" | "action" | "ai" }[]>([
    { id: "s1", name: "Recebe Contato (Formulário Site)", type: "trigger" },
    { id: "s2", name: "Análise de Sentimento (IA)", type: "ai" },
    { id: "s3", name: "Cadastra Lead no CRM ERP", type: "action" },
    { id: "s4", name: "Prepara Resposta Personalizada", type: "ai" },
    { id: "s5", name: "Dispara WhatsApp Instantâneo", type: "action" }
  ]);
  const [runningFlow, setRunningFlow] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [flowLog, setFlowLog] = useState<string[]>([]);

  const handleSimulateFlow = () => {
    if (runningFlow) return;
    setRunningFlow(true);
    setFlowLog([]);
    let i = 0;
    
    const runNext = () => {
      if (i < flowSteps.length) {
        setActiveStepIndex(i);
        const step = flowSteps[i];
        let desc = "";
        if (step.type === "trigger") desc = `🟢 [GATILHO] Iniciando fluxo: '${step.name}' capturado com sucesso.`;
        if (step.type === "ai") desc = `🧠 [INTELIGÊNCIA] Executando processamento LLM: '${step.name}' resolvido em 42ms.`;
        if (step.type === "action") desc = `⚡ [AÇÃO] Disparando webhook ou integração externa: '${step.name}' concluída.`;
        
        setFlowLog(prev => [...prev, desc]);
        i++;
        setTimeout(runNext, 1200);
      } else {
        setActiveStepIndex(null);
        setRunningFlow(false);
        setFlowLog(prev => [...prev, "🎉 [FIM] Fluxo completo executado com 100% de sucesso através do sistema KoreNexus!"]);
        triggerToast("Integração concluída com sucesso! ⚡");
      }
    };
    runNext();
  };

  const [automationEstimatePrice, setAutomationEstimatePrice] = useState(1500);
  const [flowComplexity, setFlowComplexity] = useState("medio");
  const [customOutputsCheck, setCustomOutputsCheck] = useState(3);

  useEffect(() => {
    let p = 600;
    if (flowComplexity === "alto") p = 2200;
    if (flowComplexity === "enterprise") p = 4200;
    p += (customOutputsCheck * 150);
    setAutomationEstimatePrice(p);
  }, [flowComplexity, customOutputsCheck]);

  // ----------------------------------------------------
  // TOPIC 4: SAAS SIMPLES COM IA
  // ----------------------------------------------------
  const [saasTool, setSaasTool] = useState<"legendas" | "resumidor" | "corretor">("legendas");
  const [saasDraft, setSaasDraft] = useState("");
  const [saasResult, setSaasResult] = useState("");
  const [saasLoading, setSaasLoading] = useState(false);

  const handleSaasAction = () => {
    if (!saasDraft.trim() && saasTool !== "resumidor") {
      triggerToast("Digite um rascunho de texto para analisarmos!", "error");
      return;
    }
    setSaasLoading(true);
    setSaasResult("");

    const cleaned = (saasDraft || "pdf_upload_simulado").toLowerCase().trim();
    const cached = dbEntries.find(entry => 
      entry.type === "saas" && 
      (entry.query.toLowerCase().trim() === cleaned)
    );

    if (cached) {
      setTimeout(() => {
        setSaasResult(cached.response);
        setSaasLoading(false);
        triggerToast("Copiado instantaneamente do Banco de Dados local! (Evitou consumo de IA) ⚡");
      }, 400);
      return;
    }

    setTimeout(() => {
      let r = "";
      if (saasTool === "legendas") {
        r = `💫 **Legenda Ideal Criada (Pronta para postagem):** \n\n"Entregar qualidade vai muito além do básico: é sobre construir soluções escaláveis de verdade. 🛠️ Na KoreNexus, desenhamos tecnologia que roda lisinha para a sua empresa crescer sem atritos. E você, foca na estratégia ou ainda está preso em processos mecânicos?"\n\n📌 **Hashtags sugeridas pela IA:**\n#DesenvolvimentoWeb #InovacaoSaaS #Eficiencia #KoreNexus #NegociosAuto`;
      } else if (saasTool === "resumidor") {
        r = `📄 **Resumo Executivo Extraído (PDF Analisado pelo Core Inteligente):** \n\n💡 **Principais Descobertas:**\n• Redução de desperdício em 32% após implementação do WMS com roteamento dinâmico em S.\n• Portaria automatizada reduziu o tempo médio de liberação de caminhoneiros e veículos para menos de 4 minutos por placa.\n• Integração das APIs Meta simplificou faturamentos e reduziu custos mensais de atendimento telefônico.\n\n🎯 **Conclusão:** A infraestrutura analisada está apta para expandir em até 3x o volume atual sem necessidade de novas contratações operacionais.`;
      } else {
        r = `✍️ **Versão Corrigida e Aprimorada (SEO / Copywriting Profissional):**\n\n"Desenvolvemos soluções tecnológicas sob medida para modernizar sua empresa. Reduza custos imediatamente, acabe com o retrabalho excessivo e aumente o faturamento com as automações Inteligentes da KoreNexus. Fale agora com nosso time de consultores altamente experientes."`;
      }

      // Automatically save new SaaS output to the database
      const newEntry: CacheEntry = {
        id: `db-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "saas",
        query: cleaned,
        response: r,
        categoryInfo: `SaaS (${saasTool})`,
        createdAt: new Date().toLocaleString()
      };
      saveEntriesToLocalStorage([newEntry, ...dbEntries]);

      setSaasResult(r);
      setSaasLoading(false);
      triggerToast("Processo SaaS executado e SALVO no Banco de Dados! 💾");
    }, 1500);
  };

  // ----------------------------------------------------
  // TOPIC 5: AGENTES DE IA AVANÇADOS
  // ----------------------------------------------------
  const [agentType, setAgentType] = useState<"pesquisa" | "suporte" | "relatorio">("pesquisa");
  const [agentPromptTask, setAgentPromptTask] = useState("");
  const [agentStatus, setAgentStatus] = useState<"idle" | "running" | "done">("idle");
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [finalReportOutput, setFinalReportOutput] = useState("");

  const handleHireAgentAction = () => {
    if (!agentPromptTask.trim()) {
      triggerToast("Fale o foco ou objetivo para o agente executar!", "error");
      return;
    }

    const cleaned = agentPromptTask.toLowerCase().trim();
    const cached = dbEntries.find(entry => 
      entry.type === "agentes" && 
      (entry.query.toLowerCase().trim() === cleaned)
    );

    if (cached) {
      setAgentStatus("running");
      setAgentLogs([
        "⚡ [BANCO DE DADOS DETECTADO] Resposta idêntica localizada!",
        "📂 Carregando relatório compilado do cache offline para evitar IA duplicada...",
        "🔑 Registro restaurado com sucesso em 4ms!"
      ]);
      setTimeout(() => {
        setFinalReportOutput(cached.response);
        setAgentStatus("done");
        triggerToast("Relatório recuperado do Banco de Dados! ⚡");
      }, 800);
      return;
    }

    setAgentStatus("running");
    setAgentLogs([]);
    setFinalReportOutput("");

    const logsArray = [
      "🔄 [AGENTE INICIADO] Instanciando contêiner com modelo Gemini-1.5 por KoreNexus Core...",
      "🔍 [PESQUIZA WEB] Escaneando bases de dados do setor e sites corporativos em tempo real...",
      "⚡ [ANÁLISE DE SEGMENTOS] Agrupando estatísticas históricas, removendo duplicidades fakes...",
      "🧠 [RELEVANTAÇÃO] Cruzando comportamento de concorrentes e convertendo logs de transações...",
      "📊 [MÉTRICAS DETECTADAS] Gerando gráficos de faturamento recorrente e análise sintática...",
      "📑 [COMPILANDO] Formatando relatório analítico estruturado com tabelas e projeções..."
    ];

    let logIdx = 0;
    const streamLogs = () => {
      if (logIdx < logsArray.length) {
        setAgentLogs(prev => [...prev, logsArray[logIdx]]);
        logIdx++;
        setTimeout(streamLogs, 1000);
      } else {
        setAgentStatus("done");
        let content = "";
        if (agentType === "pesquisa") {
          content = `## 📊 Relatório Estratégico de Pesquisa de Mercado (Ano 2026)\n\n**Foco solicitado:** "${agentPromptTask}"\n\n**Sumário de Tendências:**\n1. **Hiper-personalização de Atendimento**: 88% dos clientes preferem resolver via canais de texto como WhatsApp integrado do que ligar para SAC.\n2. **Infraestrutura Própria vs Cloud**: Projetos com agilidade de deploys em contêineres Docker/Kubernetes reduzem custos de manutenção de TI em 42%.\n3. **Decisão Inteligente**: Empresas locais que adotaram o ecossistema KoreNexus obtiveram retorno do investimento em apenas 75 dias.`;
        } else if (agentType === "suporte") {
          content = `## 🛡️ Relatório de Auditoria de Suporte Confeccionado\n\n**Meta:** "${agentPromptTask}"\n\n**Fatos Auditados:**\n• Conexões e chamados respondidos de forma autônoma: 95.8% de acerto.\n• Tempo de resposta padrão: Reduzido de 12 minutos para 140 milissegundos.\n• Problemas complexos escalados para atendentes humanos: Apenas 4.2% das interações volumosas.`;
        } else {
          content = `## 📈 Consolidação e Dashboard Contábil / Fiscal Completo\n\n**Analítico:** "${agentPromptTask}"\n\n• **Registros computados**: 1.540 transações fiscais processadas.\n• **Divergências encontradas**: 0 incoerências fiscais.\n• **Nota de conformidade fiscal**: 100% (Selo Verde KoreNexus Security).`;
        }

        // Save new agent report to the database
        const newEntry: CacheEntry = {
          id: `db-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: "agentes",
          query: cleaned,
          response: content,
          categoryInfo: `Agente (${agentType})`,
          createdAt: new Date().toLocaleString()
        };
        saveEntriesToLocalStorage([newEntry, ...dbEntries]);

        setFinalReportOutput(content);
        triggerToast("Sucesso! Relatório gerado e SALVO no Banco de Dados! 💾");
      }
    };
    streamLogs();
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-50 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border ${
              toast.type === "success" 
                ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-400" 
                : "bg-rose-950/95 border-rose-500/30 text-rose-400"
            } max-w-md w-[90%] filter backdrop-blur-md`}
          >
            {toast.type === "success" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="text-xs font-semibold leading-relaxed">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Neon Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-850 bg-gradient-to-br from-[#0a0f1d] via-[#02050c] to-[#010204] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute left-1/4 bottom-0 h-48 w-48 bg-purple-500/5 blur-[100px] rounded-full"></div>

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
            KoreNexus AI Developer Hub
          </div>
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl font-display font-black text-white tracking-tight">
              Soluções Avançadas de IA para sua Empresa
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Somos uma <strong className="text-white">Fábrica de Desenvolvimento de Tecnologia</strong>. Nós criamos e fornecemos as ferramentas personalizadas perfeitas para empresas e pequenas empresas prosperarem, escalarem faturamentos e automatizarem toda infraoperação com inteligência artificial de ponta.
            </p>
          </div>

          {/* Quick Metrics Bar from Photos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-gray-800/60">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-850/50">
              <span className="text-[9px] text-gray-500 uppercase font-mono block">1. Chatbots WhatsApp</span>
              <p className="text-xs text-white font-bold mt-1">Sob Consulta <span className="text-[9px] text-gray-500">/projeto</span></p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-850/50">
              <span className="text-[9px] text-gray-500 uppercase font-mono block">2. Geração de Conteúdo</span>
              <p className="text-xs text-white font-bold mt-1">Plano Customizado</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-850/50">
              <span className="text-[9px] text-gray-500 uppercase font-mono block">3. Automações de APIs</span>
              <p className="text-xs text-white font-bold mt-1">Fluxos Personalizados</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-850/50">
              <span className="text-[9px] text-gray-500 uppercase font-mono block">4. Micro-SaaS c/ IA</span>
              <p className="text-xs text-white font-bold mt-1">Faturamento Otimizado</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-850/50">
              <span className="text-[9px] text-gray-500 uppercase font-mono block">5. Agentes Inteligentes</span>
              <p className="text-xs text-white font-bold mt-1">Relatórios Sob Medida</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Selector (3 Cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-mono font-bold text-gray-500 tracking-wider uppercase ml-1 block">Nossas Verticais</h3>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveSubjectTab("whatsapp")}
              className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                activeSubjectTab === "whatsapp" 
                  ? "bg-[#0E1528] border-blue-500/70 text-white shadow-lg shadow-blue-500/5"
                  : "bg-slate-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-805"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">1. Chatbots de Atendimento</p>
                  <p className="text-[9.5px] text-gray-500 mt-0.5">WhatsApp & Web</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </button>

            <button
              onClick={() => setActiveSubjectTab("conteudo")}
              className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                activeSubjectTab === "conteudo" 
                  ? "bg-[#0E1528] border-blue-500/70 text-white shadow-lg shadow-blue-500/5"
                  : "bg-slate-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-805"
              }`}
            >
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-fuchsia-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">2. Criação de Conteúdo</p>
                  <p className="text-[9.5px] text-gray-500 mt-0.5">Posts e Social Media</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </button>

            <button
              onClick={() => setActiveSubjectTab("automacao")}
              className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                activeSubjectTab === "automacao" 
                  ? "bg-[#0E1528] border-blue-500/70 text-white shadow-lg shadow-blue-500/5"
                  : "bg-slate-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-805"
              }`}
            >
              <div className="flex items-center gap-3">
                <Workflow className="h-5 w-5 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">3. Automações de Fluxo</p>
                  <p className="text-[9.5px] text-gray-500 mt-0.5">Make, Zapier & n8n</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </button>

            <button
              onClick={() => setActiveSubjectTab("saas")}
              className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                activeSubjectTab === "saas" 
                  ? "bg-[#0E1528] border-blue-500/70 text-white shadow-lg shadow-blue-500/5"
                  : "bg-slate-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-805"
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">4. Micro-SaaS Utilitários</p>
                  <p className="text-[9.5px] text-gray-500 mt-0.5">Resumos & Legendador</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </button>

            <button
              onClick={() => setActiveSubjectTab("agentes")}
              className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                activeSubjectTab === "agentes" 
                  ? "bg-[#0E1528] border-blue-500/70 text-white shadow-lg shadow-blue-500/5"
                  : "bg-slate-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-805"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">5. Agentes de IA Autônomos</p>
                  <p className="text-[9.5px] text-gray-500 mt-0.5">Relatórios & Pesquisas</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </button>

            <button
              onClick={() => setActiveSubjectTab("database")}
              className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                activeSubjectTab === "database" 
                  ? "bg-[#0E1528] border-[#A855F7]/70 text-white shadow-lg shadow-[#A855F7]/5"
                  : "bg-slate-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-805"
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">6. Banco de Dados Offline</p>
                  <p className="text-[9.5px] text-gray-500 mt-0.5">Evitar Consumo de IA</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
            </button>
          </div>

          {/* Quick info about our company */}
          <div className="p-4 bg-slate-950/30 border border-gray-850/50 rounded-2xl space-y-2">
            <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider block">Garantia KoreNexus</span>
            <p className="text-[11px] text-gray-500 leading-normal">
              Como desenvolvedores especialistas, entregamos toda infraestrutura de nuvem, integrações nativas de banco de dados e APIs monitoradas pelas melhores métricas do mercado de tecnologia em 2026.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Playground Container (9 Cols) */}
        <div className="lg:col-span-9 bg-[#0B101D] border border-gray-800 rounded-2xl p-6 min-h-[580px] flex flex-col justify-between">
          
          {/* TAB 1: WHATSAPP CHATBOT BUILDER */}
          {activeSubjectTab === "whatsapp" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                    Atendimento Automático de Conversas (WhatsApp & Web)
                  </h2>
                  <p className="text-[11.5px] text-gray-400">Insira regras de gatilho de sua empresa e faça o teste da IA ao vivo no simulador telefônico.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
                  Status do Módulo: Pronto para Produção
                </span>
              </div>

              {/* Grid Builder & Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Left side: Rules Editor */}
                <div className="space-y-4 bg-slate-950/45 p-4 rounded-xl border border-gray-850">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Identidade ou Função</label>
                    <input
                      type="text"
                      className="w-full bg-[#0E1524] border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Instruções Sistêmicas da IA</label>
                    <textarea
                      rows={2}
                      className="w-full bg-[#0E1524] border border-gray-800 focus:border-blue-500 rounded-xl px-03 py-2 text-xs text-white"
                      value={botPrompt}
                      onChange={(e) => setBotPrompt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Palavras Auxiliares de Desvio (Gatilhos)</label>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {botKeywords.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center justify-between p-2 rounded-lg bg-[#0E1524] border border-gray-800">
                          <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{item.trigger}</span>
                          <span className="text-[10.5px] truncate text-slate-300 max-w-[160px]">{item.reply}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Realistic Mobile Simulator */}
                <div className="flex flex-col h-[380px] bg-[#03060E] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                  {/* Phone Header */}
                  <div className="bg-[#0E1524] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{botName}</p>
                        <p className="text-[9.5px] text-gray-400 mt-1">KoreNexus Auto Chatbot</p>
                      </div>
                    </div>
                    <Smartphone className="h-4 w-4 text-gray-500" />
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none flex flex-col">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                        <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user" 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-[#0E1524] text-slate-200 border border-gray-800 rounded-bl-none"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[8px] text-gray-600 mt-1 font-mono">{msg.time}</span>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="mr-auto bg-[#0E1524] border border-gray-800 p-2.5 rounded-2xl rounded-bl-none flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input bar */}
                  <div className="p-2 border-t border-gray-850 flex gap-2 bg-[#0A0E1A]">
                    <input
                      type="text"
                      className="flex-1 bg-[#121A2E] border border-gray-800 focus:outline-none rounded-xl text-xs text-white px-3"
                      placeholder="Responda ou simule o cliente corporal..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Dynamic Project Quotator */}
              <div className="bg-[#0E1524]/60 p-4 border border-gray-800 rounded-xl">
                <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase block mb-3">Calculadora de Configuração WhatsApp</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <label className="flex items-center gap-3 bg-slate-950/30 p-2.5 border border-gray-850 rounded-lg cursor-pointer hover:border-gray-750">
                    <input type="checkbox" checked={hasIntegration} onChange={(e) => setHasIntegration(e.target.checked)} className="rounded text-blue-500 bg-gray-900 border-gray-700" />
                    <div>
                      <p className="font-bold text-white">Integração API Externa</p>
                      <p className="text-[10px] text-gray-500">Google Sheets, CRM síncrono</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 bg-slate-950/30 p-2.5 border border-gray-850 rounded-lg cursor-pointer hover:border-gray-750">
                    <input type="checkbox" checked={dbSync} onChange={(e) => setDbSync(e.target.checked)} className="rounded text-blue-500 bg-gray-900 border-gray-700" />
                    <div>
                      <p className="font-bold text-white">Banco de Dados Histórico</p>
                      <p className="text-[10px] text-gray-500">Persistência SQL / Firestore</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 bg-slate-950/30 p-2.5 border border-gray-850 rounded-lg cursor-pointer hover:border-gray-750">
                    <input type="checkbox" checked={aiAdvanced} onChange={(e) => setAiAdvanced(e.target.checked)} className="rounded text-blue-500 bg-gray-900 border-gray-700" />
                    <div>
                      <p className="font-bold text-white">Modelo Generativo (Pro)</p>
                      <p className="text-[10px] text-gray-500">Prompt de IA Avançado</p>
                    </div>
                  </label>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                  <p className="text-[10.5px] text-gray-500 leading-normal">Oferecemos fluxos inteligentes com taxas fixas de manutenção conforme volumetria da empresa.</p>
                  <div className="text-right">
                    <span className="text-[9.5px] text-gray-400 block font-semibold uppercase tracking-wider">Viabilidade de Implantação</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 uppercase">Estudo de Escopo Incluso</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT GENERATOR */}
          {activeSubjectTab === "conteudo" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-fuchsia-400" />
                    Geração de Conteúdo Inteligente (Social Media AI Poster)
                  </h2>
                  <p className="text-[11.5px] text-gray-400">Automatize seus posts no Instagram, Linkedin ou seções completas de blogs corporativos.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-3 py-1 rounded-full">
                  Cobrança Mensal Recorrente
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Left controls */}
                <div className="space-y-4 bg-slate-950/45 p-4 rounded-xl border border-gray-850/70">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider block font-bold">O que vamos postar ou promover?</label>
                    <input
                      type="text"
                      className="w-full bg-[#121A2E] border border-gray-800 focus:border-blue-500 rounded-xl text-xs text-white px-3 py-2"
                      placeholder="Ex: Novo serviço KoreNexus de WMS com inteligência..."
                      value={contentTopic}
                      onChange={(e) => setContentTopic(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider block">Canal Base</label>
                      <select
                        className="w-full bg-[#121A2E] border border-gray-800 rounded-xl text-xs text-white p-2"
                        value={contentPlatform}
                        onChange={(e) => setContentPlatform(e.target.value as any)}
                      >
                        <option value="instagram">📸 Instagram Caption</option>
                        <option value="linkedin">👔 LinkedIn Post</option>
                        <option value="blog">✍️ Artigo Blog (SEO)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider block">Tom de Voz</label>
                      <select
                        className="w-full bg-[#121A2E] border border-gray-800 rounded-xl text-xs text-white p-2"
                        value={contentTone}
                        onChange={(e) => setContentTone(e.target.value as any)}
                      >
                        <option value="vendedor">⚡ Persuasivo / Vendas</option>
                        <option value="tecnico">🧠 Informativo / Técnico</option>
                        <option value="descontraido">🔥 Descontraído</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateContent}
                    disabled={generatingContent}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-xs font-bold uppercase rounded-xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    {generatingContent ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Minimizando rascunhos e polindo Copy...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Gerar Postagem com IA de Alta Conversão
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated Feed Output Preview */}
                <div className="bg-[#03060E] border border-gray-800 rounded-2xl p-4 min-h-[220px] flex flex-col justify-between shadow-xl relative">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-gray-950">
                      <div className="h-6 w-6 rounded-full bg-fuchsia-600 text-white flex items-center justify-center text-[10px] font-black uppercase shadow">KN</div>
                      <div className="leading-none">
                        <span className="text-[11px] font-bold text-white block">korenexus.tech</span>
                        <span className="text-[8.5px] text-gray-500">Desenvolvimento Independente</span>
                      </div>
                    </div>
                    
                    <div className="text-[11px] leading-relaxed text-slate-300 font-sans whitespace-pre-wrap max-h-56 overflow-y-auto pr-1">
                      {generatedOutput || "Preencha a área ao lado e clique em \"Gerar Postagem\" para ver o motor criativo da KoreNexus atuar em tempo real!"}
                    </div>
                  </div>

                  {generatedOutput && (
                    <div className="flex justify-end pt-3 border-t border-gray-950">
                      <button
                        onClick={() => copyToClipboard(generatedOutput, "Cópia Conteúdo")}
                        className="flex items-center gap-1 text-[9.5px] font-mono text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer bg-[#0A0E1B] px-2 py-1 rounded border border-gray-850"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copiar Postagem
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Cost Planner */}
              <div className="bg-[#0E1524]/60 p-4 border border-gray-800 rounded-xl relative">
                <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase block mb-3">Plano Mensal de Volume e Freqüência</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-3 font-medium">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Entregáveis de IA:</span>
                      <select 
                        className="bg-slate-950 border border-gray-800 text-white rounded px-2 py-1 select-all cursor-pointer text-[11px]"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                      >
                        <option value="12_posts">📦 12 Posts Mensais + IA Hashtags</option>
                        <option value="24_posts">🚀 24 Posts Mensais + IA Planos</option>
                        <option value="30_posts">🔥 30 Posts Completos (Diário)</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Servidor Ativo dedicado:</span>
                      <span className="text-white font-mono text-[11.5px]">24 Horas / Sem interrupções</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded-xl border border-gray-850/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">Instalação e Licenciamento</span>
                      <span className="text-xs text-white font-bold">Incluso no ecossistema</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 uppercase block font-semibold">Valor Recorrente</span>
                      <span className="text-sm font-mono font-bold text-fuchsia-400">Plano Sob Medida <span className="text-[9.5px] text-gray-500">/mês</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATIONS AND WORKFLOWS */}
          {activeSubjectTab === "automacao" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-indigo-400" />
                    Automação e Conexão de Processos Corporativos (n8n, Zapier & Make)
                  </h2>
                  <p className="text-[11.5px] text-gray-400">Interligue formulários de contatos, e-mails comerciais e bancos de dados sem intervenção braçal.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                  Status do Módulo: Altamente Escalável
                </span>
              </div>

              {/* Connected flowchart preview */}
              <div className="p-5 bg-[#03060D] border border-gray-800 rounded-2xl">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <span className="text-[10.5px] text-gray-500 font-bold uppercase tracking-widest block font-mono">Estrutura de Webhook e Roteamento</span>
                  
                  <button
                    onClick={handleSimulateFlow}
                    disabled={runningFlow}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="h-3 w-3 text-white" />
                    Simular Execução do Fluxo
                  </button>
                </div>

                {/* Nodes row */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 py-6 overflow-x-auto">
                  {flowSteps.map((step, idx) => {
                    const isActive = activeStepIndex === idx;
                    const isTrigger = step.type === "trigger";
                    const isAi = step.type === "ai";

                    return (
                      <React.Fragment key={step.id}>
                        <div className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 text-center min-w-[130px] ${
                          isActive 
                            ? "bg-[#1E1B4B] border-blue-400 shadow shadow-blue-500/10 text-white scale-110" 
                            : "bg-slate-950/40 border-gray-850 text-gray-300"
                        }`}>
                          {isTrigger ? (
                            <ArrowRightLeft className="h-4 w-4 text-emerald-400" />
                          ) : isAi ? (
                            <Zap className="h-4 w-4 text-amber-400" />
                          ) : (
                            <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                          )}
                          <span className="text-[10.5px] font-bold leading-tight font-sans">{step.name}</span>
                          <span className="text-[8.5px] text-gray-500 uppercase font-mono">{step.type}</span>
                        </div>
                        {idx < flowSteps.length - 1 && (
                          <div className={`h-1 w-8 shrink-0 md:h-px md:w-8 bg-gradient-to-r ${
                            isActive ? "from-blue-500 to-indigo-500" : "from-gray-800 to-gray-800"
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Flow Logs */}
                <div className="bg-[#070A13] rounded-xl p-3 border border-slate-900 min-h-[90px] max-h-36 overflow-y-auto">
                  <p className="text-[9px] text-gray-600 font-mono uppercase tracking-wider mb-2">Logs de processamento em tempo real:</p>
                  <div className="space-y-1 text-[10px] font-mono leading-relaxed">
                    {flowLog.map((log, lIdx) => (
                      <p key={lIdx} className="text-gray-300">{log}</p>
                    ))}
                    {flowLog.length === 0 && (
                      <p className="text-gray-500 italic">Dispare o webhook ao lado para verificar a latência de tráfego das conexões.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Flow Cost Estimate Form */}
              <div className="bg-[#0E1524]/60 p-4 border border-gray-800 rounded-xl">
                <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase block mb-3">Orçamento Dinâmico para Automações de API</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-mono">Complexidade do Fluxo</label>
                    <select
                      className="w-full bg-slate-950 border border-gray-800 text-white rounded-lg p-2 text-xs"
                      value={flowComplexity}
                      onChange={(e) => setFlowComplexity(e.target.value)}
                    >
                      <option value="medio">⚡ Interações Simples (n8n Standard)</option>
                      <option value="alto">🚀 Multi-Sistemas Integrados (Zapier Premium)</option>
                      <option value="enterprise">🏢 Fluxo Crítico c/ Servidor Dedicado</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-mono">Destinos / Webhooks Adicionais ({customOutputsCheck})</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      className="w-full bg-slate-950 border border-gray-800 text-white rounded-lg p-1.5 text-xs font-mono"
                      value={customOutputsCheck}
                      onChange={(e) => setCustomOutputsCheck(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="md:col-span-4 p-3 bg-slate-950 rounded-lg border border-gray-850 flex items-center justify-between text-right">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block tracking-wider font-mono">Viabilidade do Fluxo</span>
                      <span className="text-sm font-mono font-bold text-indigo-400">Totalmente Compatível</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MICRO-SAAS TOOL PLAYGROUND */}
          {activeSubjectTab === "saas" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    Desenvolvimento e Hospedagem de Micro-SaaS
                  </h2>
                  <p className="text-[11.5px] text-gray-400">Fornecemos micro-aplicativos inteligentes e utilitários que geram receita recorrente todos os meses.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
                  Receita Recorrente Mensal
                </span>
              </div>

              {/* Playgrounds of three tools from screens */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-800 pb-px">
                  <button
                    onClick={() => { setSaasTool("legendas"); setSaasDraft(""); setSaasResult(""); }}
                    className={`pb-2.5 text-xs font-bold uppercase transition relative cursor-pointer ${
                      saasTool === "legendas" ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    1. Gerador de Legendas
                  </button>
                  <button
                    onClick={() => { setSaasTool("resumidor"); setSaasDraft(""); setSaasResult(""); }}
                    className={`pb-2.5 text-xs font-bold uppercase transition relative cursor-pointer ${
                      saasTool === "resumidor" ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    2. Resumidor de PDFs
                  </button>
                  <button
                    onClick={() => { setSaasTool("corretor"); setSaasDraft(""); setSaasResult(""); }}
                    className={`pb-2.5 text-xs font-bold uppercase transition relative cursor-pointer ${
                      saasTool === "corretor" ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    3. Corretor de Textos
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  {/* Left input workspace */}
                  <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-xl border border-gray-850">
                    {saasTool === "legendas" && (
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Descreva o produto ou vibe do post</label>
                        <textarea
                          rows={4}
                          className="w-full bg-[#121A2E] border border-gray-800 focus:border-blue-500 rounded-lg text-xs p-2 text-white placeholder-gray-600"
                          placeholder="Ex: Entrega de softwares excepcionais, equipe focada da KoreNexus, agilidade em tecnologia de ponta..."
                          value={saasDraft}
                          onChange={(e) => setSaasDraft(e.target.value)}
                        />
                      </div>
                    )}

                    {saasTool === "resumidor" && (
                      <div className="space-y-3">
                        <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Selecione o arquivo PDF para processamento em lote</label>
                        <div className="border-2 border-dashed border-gray-800 hover:border-gray-700 rounded-xl p-6 text-center cursor-pointer transition">
                          <FileText className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                          <p className="text-xs text-white font-semibold">Relatorio_Operacional_KoreNexus.pdf</p>
                          <p className="text-[10px] text-gray-500 mt-1">Carregado e pronto para consolidação automática</p>
                        </div>
                      </div>
                    )}

                    {saasTool === "corretor" && (
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-bold">Digite seu rascunho rápido para melhoria gramatical</label>
                        <textarea
                          rows={4}
                          className="w-full bg-[#121A2E] border border-gray-800 focus:border-blue-500 rounded-lg text-xs p-2 text-white placeholder-gray-600 font-mono"
                          placeholder="nos fazemos solusoes de tecnologia pra modernizar as firmas, diminua custos imediatos com korenexus..."
                          value={saasDraft}
                          onChange={(e) => setSaasDraft(e.target.value)}
                        />
                      </div>
                    )}

                    <button
                      onClick={handleSaasAction}
                      disabled={saasLoading}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-[10.5px] font-bold uppercase rounded-lg transition shadow cursor-pointer"
                    >
                      {saasLoading ? "Aguardando Resposta do SaaS Engine..." : "Processar com IA do Sistema"}
                    </button>
                  </div>

                  {/* Right result preview */}
                  <div className="p-4 bg-[#03060C] border border-gray-800 rounded-xl min-h-[190px] flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-mono block mb-2 font-bold tracking-widest">Painel SaaS da Vizinhança</span>
                      <div className="text-[11px] leading-relaxed text-slate-300 font-sans whitespace-pre-wrap">
                        {saasResult || (saasLoading ? "O motor autônomo está analisando as tokens do documento..." : "Os dados consolidados estruturados e melhorados aparecerão aqui em poucos milissegundos após clicar em Processar.")}
                      </div>
                    </div>

                    {saasResult && (
                      <div className="flex justify-end pt-3 border-t border-gray-950">
                        <button
                          onClick={() => copyToClipboard(saasResult, "SaaS Output")}
                          className="flex items-center gap-1.5 text-[9.5px] font-mono text-blue-400 hover:text-blue-300 cursor-pointer bg-slate-950 px-2 py-1 rounded border border-gray-850"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copiar Resultado
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AGENTS DE IA */}
          {activeSubjectTab === "agentes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                    Agentes de IA Avançados (Pesquisa, Resposta & Relatórios)
                  </h2>
                  <p className="text-[11.5px] text-gray-400">Hospede e treine agentes com capacidade de varredura web, análise de inteligência de mercado e emissão de PDFs.</p>
                </div>
                <span className="text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full">
                  Mercado em alta em 2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Agent configurator */}
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-gray-850">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase font-mono block">Especialidade / Perfil do Agente</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { setAgentType("pesquisa"); setAgentLogs([]); setFinalReportOutput(""); }}
                        className={`p-2 rounded-lg text-[10px] uppercase font-bold text-center border cursor-pointer hover:border-purple-500/50 transition ${
                          agentType === "pesquisa" ? "bg-purple-950/30 border-purple-500 text-purple-400" : "bg-[#0E1524] border-gray-800 text-gray-400"
                        }`}
                      >
                        Pesquisas
                      </button>
                      <button
                        onClick={() => { setAgentType("suporte"); setAgentLogs([]); setFinalReportOutput(""); }}
                        className={`p-2 rounded-lg text-[10px] uppercase font-bold text-center border cursor-pointer hover:border-purple-500/50 transition ${
                          agentType === "suporte" ? "bg-purple-950/30 border-purple-500 text-purple-400" : "bg-[#0E1524] border-gray-800 text-gray-400"
                        }`}
                      >
                        Suporte N2
                      </button>
                      <button
                        onClick={() => { setAgentType("relatorio"); setAgentLogs([]); setFinalReportOutput(""); }}
                        className={`p-2 rounded-lg text-[10px] uppercase font-bold text-center border cursor-pointer hover:border-purple-500/50 transition ${
                          agentType === "relatorio" ? "bg-purple-950/30 border-purple-500 text-purple-400" : "bg-[#0E1524] border-gray-800 text-gray-400"
                        }`}
                      >
                        Relatórios
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase font-mono block">Foco ou objetivo para o seu Agente Executar</label>
                    <textarea
                      rows={3}
                      className="w-full bg-[#121A2E] border border-gray-800 focus:border-blue-500 rounded-lg text-xs p-2 text-white placeholder-gray-600"
                      placeholder="Ex: Pesquise os modems, concorrentes do provedor ou faça relatórios contábeis de auditoria..."
                      value={agentPromptTask}
                      onChange={(e) => setAgentPromptTask(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleHireAgentAction}
                    disabled={agentStatus === "running"}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white text-[10.5px] font-bold uppercase rounded-lg transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {agentStatus === "running" ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        Agente Pensando...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4.5 w-4.5" />
                        Despolarizar Agente Autônomo
                      </>
                    )}
                  </button>
                </div>

                {/* Live Console Output Log */}
                <div className="p-4 bg-[#03060C] border border-gray-800 rounded-xl flex flex-col justify-between min-h-[250px]">
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1 font-mono">
                    <span className="text-[9px] text-gray-500 uppercase block font-bold tracking-widest border-b border-gray-950 pb-2 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-purple-400" />
                      Painel Log de Execução Autônoma
                    </span>
                    
                    {agentLogs.map((log, i) => (
                      <p key={i} className="text-[10.5px] text-emerald-400 leading-normal">{log}</p>
                    ))}

                    {agentStatus === "done" && finalReportOutput && (
                      <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-gray-850 font-sans text-xs text-slate-300 leading-relaxed max-w-full overflow-x-auto whitespace-pre-wrap">
                        {finalReportOutput}
                      </div>
                    )}

                    {agentStatus === "idle" && (
                      <p className="text-[11px] text-gray-600 italic font-sans leading-relaxed">Digite o escopo para o Agente Corporativo e veja os logs de pesquisa estruturada do Core KoreNexus executarem no terminal conceitual.</p>
                    )}
                  </div>

                  {agentStatus === "done" && (
                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-950 mt-2 shrink-0">
                      <button
                        onClick={() => triggerToast("PDF descarregado para a máquina local! Sincronia concluída.", "success")}
                        className="flex items-center gap-1.5 text-[9.5px] font-mono text-purple-400 hover:text-purple-300 cursor-pointer bg-slate-950 px-2 py-1 rounded border border-gray-850"
                      >
                        <FileDown className="h-3.5 w-3.5" /> Salvar Relatório PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubjectTab === "database" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-400 animate-pulse" />
                    Gerenciador de Banco de Dados de Respostas (Cache Local)
                  </h2>
                  <p className="text-[11.5px] text-gray-400">
                    Sincronizador inteligente KoreNexus para reduzir requisições de IA e evitar termos repetidos.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                  Conexão Ativa
                </span>
              </div>

              {/* Database Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-gray-850">
                  <span className="text-[9px] uppercase font-mono text-gray-500 block">Total de Entradas</span>
                  <p className="text-xl text-white font-extrabold mt-1">{dbEntries.length} Registros</p>
                  <p className="text-[9.5px] text-gray-500 mt-1">Salvos dinamicamente off/online</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-gray-850">
                  <span className="text-[9px] uppercase font-mono text-gray-500 block">IA Repetida Evitada</span>
                  <p className="text-xl text-emerald-400 font-extrabold mt-1">Ativo (100%)</p>
                  <p className="text-[9.5px] text-gray-500 mt-1">Evita custos redundantes</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-gray-850">
                  <span className="text-[9px] uppercase font-mono text-gray-500 block">Sincronia do Banco</span>
                  <p className="text-xl text-purple-400 font-extrabold mt-1">LocalStorage</p>
                  <p className="text-[9.5px] text-gray-500 mt-1">Permanece mesmo após atualizar</p>
                </div>
              </div>

              {/* Form to insert custom manual response / seed */}
              <div className="p-5 bg-slate-900/30 rounded-xl border border-gray-850 space-y-4">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                  📥 Inserir Novo Registro Manual no Banco de Dados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="text-[10px] uppercase font-mono text-gray-500 block mb-1">Módulo / Tipo</label>
                    <select
                      value={newDbType}
                      onChange={(e) => setNewDbType(e.target.value as any)}
                      className="w-full bg-[#121A2E] border border-gray-800 focus:border-purple-500 rounded-lg text-xs p-2 text-white h-[38px] cursor-pointer"
                    >
                      <option value="chatbot">Atendimento de Chatbot</option>
                      <option value="conteudo">Geração de Conteúdo</option>
                      <option value="saas">SaaS Utilitário</option>
                      <option value="agentes">Agentes de IA</option>
                    </select>
                  </div>

                  <div className="md:col-span-8">
                    <label className="text-[10px] uppercase font-mono text-gray-500 block mb-1">Palavra-Chave / Assunto do Prompt (Gatilho exato)</label>
                    <input
                      type="text"
                      className="w-full bg-[#121A2E] border border-gray-800 focus:border-purple-500 rounded-lg text-xs p-2 text-white placeholder-gray-600 h-[38px]"
                      placeholder="Ex: preco, contato, wms logistica, faturamento anual..."
                      value={newDbQuery}
                      onChange={(e) => setNewDbQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-gray-500 block mb-1">Resposta que o Sistema Deve Retornar</label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#121A2E] border border-gray-800 focus:border-purple-500 rounded-lg text-xs p-2 text-white placeholder-gray-600"
                    placeholder="Escreva inteiramente a resposta em texto rico que será retornada sem acionar a Inteligência Artificial..."
                    value={newDbResponse}
                    onChange={(e) => setNewDbResponse(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (!newDbQuery.trim() || !newDbResponse.trim()) {
                        triggerToast("Preencha o gatilho e a resposta!", "error");
                        return;
                      }
                      const cleanQuery = newDbQuery.toLowerCase().trim();
                      const key = `db-${Date.now()}`;
                      const newItem: CacheEntry = {
                        id: key,
                        type: newDbType,
                        query: cleanQuery,
                        response: newDbResponse,
                        categoryInfo: "Manual Seed",
                        createdAt: new Date().toLocaleString()
                      };
                      const updated = [newItem, ...dbEntries];
                      saveEntriesToLocalStorage(updated);
                      setNewDbQuery("");
                      setNewDbResponse("");
                      triggerToast("Salvo com sucesso no Banco de Dados local! 💾");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10.5px] font-bold uppercase rounded-lg transition shadow cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Cadastrar no Banco
                  </button>
                </div>
              </div>

              {/* Database Search Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                    📂 Registros Computados na Memória Ativa
                  </h3>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    <input
                      type="text"
                      className="w-full bg-[#121A2E] border border-gray-800 focus:border-purple-500 rounded-lg text-xs pl-8 pr-3 py-1.5 text-white placeholder-gray-500"
                      placeholder="Pesquisar por gatilho ou resposta..."
                      value={dbSearchFilter}
                      onChange={(e) => setDbSearchFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-850 rounded-xl bg-slate-950/40">
                  <table className="w-full text-left text-xs min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-850 bg-slate-900/60 font-mono text-gray-500 text-[10px] uppercase">
                        <th className="p-3">Módulo</th>
                        <th className="p-3">Gatilho</th>
                        <th className="p-3">Resposta Prevista</th>
                        <th className="p-3">Data</th>
                        <th className="p-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850/50">
                      {dbEntries
                        .filter(entry => 
                          entry.query.toLowerCase().includes(dbSearchFilter.toLowerCase()) || 
                          entry.response.toLowerCase().includes(dbSearchFilter.toLowerCase()) ||
                          entry.type.toLowerCase().includes(dbSearchFilter.toLowerCase())
                        )
                        .map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-900/20 transition-colors">
                            <td className="p-3 font-semibold">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono ${
                                entry.type === "chatbot" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" :
                                entry.type === "conteudo" ? "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20" :
                                entry.type === "saas" ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" :
                                "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                              }`}>
                                {entry.type}
                              </span>
                            </td>
                            <td className="p-3 max-w-[150px] truncate font-mono text-slate-300 font-bold whitespace-nowrap">
                              "{entry.query}"
                            </td>
                            <td className="p-3 max-w-[280px] truncate text-gray-400 leading-relaxed font-sans" title={entry.response}>
                              {entry.response}
                            </td>
                            <td className="p-3 text-gray-500 font-mono text-[10px] whitespace-nowrap">
                              {entry.createdAt}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => copyToClipboard(entry.response, "Resposta")}
                                  className="p-1 px-2 rounded bg-slate-900 border border-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
                                  title="Copiar Texto"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = dbEntries.filter(item => item.id !== entry.id);
                                    saveEntriesToLocalStorage(updated);
                                    triggerToast("Entrada removida do Banco de Dados! 🧹", "success");
                                  }}
                                  className="p-1 px-2 rounded bg-rose-950/40 border border-rose-900/30 text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition cursor-pointer"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      {dbEntries.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                            Nenhum registro encontrado no Banco de Dados offline. Cadastre acima para testar!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Solid enterprise reassurance bar */}
          <div className="mt-6 pt-4 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Sistemas Seguros c/ API Oficial Google, Cloudflare & Meta Business.
            </span>
            <div className="flex gap-4 text-[10.5px] font-mono text-slate-400">
              <span>SLA: 99.99%</span>
              <span>Suporte 24/7 Ativo</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
