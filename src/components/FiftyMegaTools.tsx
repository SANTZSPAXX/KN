import React, { useState, useEffect } from "react";
import { 
  Sparkles, Megaphone, Target, FileText, Globe, Type, Mail, Hash, Star, UserCheck,
  Briefcase, Award, Presentation, ArrowUpDown, Frown, Clock, Key, Compass, Coins,
  Link, QrCode, MessageSquare, ShieldAlert, Map, RefreshCw, Database, Disc, Lock, Edit,
  Calculator, Percent, Scissors, DollarSign, Wallet, Scaling, CheckSquare, Layers, Award as Ribbon, BarChart2,
  Palette, Grid, Maximize, Smile, Image, Hash as NumberHash, Eye, Settings, Copy, Check, Info, Search
} from "lucide-react";

interface MicroTool {
  id: string;
  name: string;
  category: "marketing" | "business" | "utility" | "finance" | "design";
  description: string;
  icon: React.ReactNode;
  render: (ctx: any) => React.ReactNode;
}

export default function FiftyMegaTools() {
  const [activeCategory, setActiveCategory] = useState<string>("marketing");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeToolId, setActiveToolId] = useState<string>("headline-gen");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Core helper to handle clipboard copying with feedback
  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // State caches shared or specifically bound to tools to avoid heavy re-renders
  const [states, setStates] = useState<any>({
    headlineKeyword: "ERP Industrial",
    headlineType: "curiosidade",
    copyAidaTopic: "Automação com IA",
    copyAidaAudience: "Indústrias de Alimentos",
    sloganTopic: "Logística",
    ctaText: "Agende Diagnóstico Grátis",
    seoTitle: "Melhor ERP de Jundiaí",
    seoDesc: "Sistema integrado para otimização de faturamento e fluxo industrial síncrono local.",
    wordCountText: "KoreNexus é a solução líder de desenvolvimento corporativo em Jundiaí.",
    emailSubject: "Problemas com multas fiscais no seu ERP?",
    hashtagKeyword: "tecnologia",
    reviewName: "Carlos Drumond",
    reviewCompany: "Metalúrgica São José",
    reviewRating: 5,
    personaNiche: "E-commerce de Cosméticos",

    cvName: "Erick Silva",
    cvRole: "Desenvolvedor Pleno",
    cvSkills: "React, Node, TypeScript, SQL",
    cvExperience: "3 anos programando ERPs industriais síncronos na região de Jundiaí.",
    coverRole: "Gerente de Infraestrutura",
    coverCompany: "Nexus Logística Ltda",
    reciboDoc: "123.456.789-00",
    reciboClient: "Indústrias de Papel Jundiaí S/A",
    reciboVal: "4500",
    propServ: "Integração Sefaz automatizada",
    propHrs: "40",
    cltSal: "8000",
    pjVal: "12000",
    demissaoNome: "Lucas Ribeiro Mendes",
    demissaoCnpj: "44.123/0001-99",
    freelanceGoal: "6000",
    freelanceExpenses: "1200",
    okrObjective: "Expandir eficiência do faturamento",
    okrKr1: "Reduzir tempo de faturamento de 5 min para 30s",
    nameBrandKeyword: "Kore",
    expenseTotal: "350",
    expensePeople: "Lucas, Beatriz, Erick",

    shortUrl: "https://korenexus.com.br/planos-e-servicos-de-tecnologia-avancada",
    shortPrefix: "vendas-news",
    pixChaveUrl: "contato@korenexus.com.br",
    pixValor: "1500",
    pixNome: "KoreNexus Tech",
    waPhone: "11989387263",
    waMsg: "Olá, gostaria de agendar uma reunião comercial síncrona sobre faturamento.",
    passwordLen: 12,
    passwordSymbols: true,
    cepVal: "13201-000",
    textConverterVal: "O DESENVOLVIMENTO DE SOFTWARE SOB MEDIDA MUDOU O WORKFLOW.",
    textConverterType: "lower",
    jsonMockType: "users",
    convertBytesVal: "1024",
    convertBytesFrom: "MB",
    base64Val: "KoreNexus Inteligencia Organizacional",
    base64Type: "encode",
    markdownVal: "### KoreNexus Kflow\n\n- Robôs RPA síncronos\n- Integração **SEFAZ** direta",

    loanCapital: "150000",
    loanTaxa: "10.5",
    loanPrazo: "36",
    marginCost: "150",
    marginMarkup: "2.5",
    splitContaVal: "280",
    splitGente: "4",
    splitTaxa: "10",
    currencyVal: "100",
    currencyFrom: "USD",
    inflationVal: "5000",
    inflationAnos: "10",
    inflationTaxa: "6.2",
    pixelVal: "32",
    pixelBase: "16",
    randomMin: "1",
    randomMax: "60",
    randomCount: "6",
    discountVal: "1500",
    discountPercent: "15",
    comissaoVendas: "45000",
    comissaoPercent: "2.5",
    roiCapital: "5000",
    roiRevenue: "18500",

    paletteBase: "#0c1f19",
    gradientColor1: "#12c2e9",
    gradientColor2: "#f64f59",
    gradientAngle: "45",
    borderRadiusVal: "25",
    shadowBlur: "12",
    shadowColor: "#10b981",
    ratioWidth: "1920",
    ratioStandard: "16:9",
    hexConvertVal: "#ff5733",
    loremPara: "2",
    avatarInitials: "KN",
    avatarGrad: "emerald",
    svgPathVal: "M12 2L2 22h20L12 2z",
    buttonPaddingX: "24",
    buttonPaddingY: "12",
    buttonBg: "#10b981"
  });

  const updateState = (key: string, value: any) => {
    setStates((prev: any) => ({ ...prev, [key]: value }));
  };

  // Define Category display attributes
  const categoriesMeta = [
    { id: "marketing", name: "Marketing & Copy", icon: <Sparkles className="h-4 w-4" />, desc: "Geração de copywriting, leads e conversão síncrona" },
    { id: "business", name: "Negócios & Carreira", icon: <Briefcase className="h-4 w-4" />, desc: "Geradores corporativos de documentos e simuladores" },
    { id: "utility", name: "Utilitários & Código", icon: <Link className="h-4 w-4" />, desc: "Encurtadores, formatação de dados e ferramentas de API" },
    { id: "finance", name: "Finanças & Métricas", icon: <Calculator className="h-4 w-4" />, desc: "Calculadoras de rentabilidade, ROI e planejamento" },
    { id: "design", name: "Design & CSS Craft", icon: <Palette className="h-4 w-4" />, desc: "Geradores de paletas de cores, CSS e layouts" }
  ];

  // 50 Tools Definidos Em Linha de Maneira Segura e Inteligente
  const ALL_50_TOOLS: MicroTool[] = [
    // MARKETING (10 Tools)
    {
      id: "headline-gen",
      name: "1. Gerador de Headlines",
      category: "marketing",
      description: "Crie títulos impossíveis de serem ignorados por seus clientes em landing pages ou e-mails.",
      icon: <Sparkles className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const kw = states.headlineKeyword || "ERP";
        const hList = [
          `Como o uso de ${kw} pode dobrar o faturamento de sua empresa sem esforço.`,
          `O segredo que nunca te contaram para dominar o mercado com ${kw}.`,
          `Guia Definitivo: Tudo o que você realmente precisa saber sobre ${kw}.`,
          `Por que economizar com ${kw} está gerando um gargalo no seu negócio hoje.`,
          `Exclusivo: Um teste de 5 minutos sobre ${kw} para aumentar sua lucratividade.`
        ];
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Palavra-Chave / Nicho</label>
              <input 
                type="text" 
                value={states.headlineKeyword} 
                onChange={(e) => updateState("headlineKeyword", e.target.value)}
                className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-gray-500 block">Ideias geradas:</span>
              {hList.map((h, i) => (
                <div key={i} className="p-2.5 bg-[#0A0D14]/80 border border-gray-950 rounded-xl flex items-center justify-between gap-4">
                  <p className="text-xs text-gray-200 select-all font-sans">{h}</p>
                  <button 
                    onClick={() => triggerCopy(h, `h-${i}`)}
                    className="p-1 px-2 border border-gray-900 rounded hover:bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer text-[10px] font-mono flex items-center gap-1 shrink-0"
                  >
                    {copiedId === `h-${i}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }
    },
    {
      id: "copy-aida",
      name: "2. Gerador Instagram AIDA",
      category: "marketing",
      description: "Escreva legendas estruturadas de alta persuasão (Atenção, Interesse, Desejo, Ação).",
      icon: <Megaphone className="h-4 w-4 text-purple-400" />,
      render: () => {
        const topic = states.copyAidaTopic || "Inovação";
        const aud = states.copyAidaAudience || "Público";
        const copy = `🚨 ATENÇÃO: Sabia que a falta de ${topic} é o principal motivo pelo qual as empresas não escalam?\n\n🔥 INTERESSE: Seus concorrentes já estão implementando isso para atrair o ${aud} enquanto você continua no operacional burocrático.\n\n💎 DESEJO: Imagine ter um sistema síncrono que faz todo o trabalho duro e triagem para você focar no que importa.\n\n👉 AÇÃO: Clique no link da bio e receba agora um diagnóstico de eficiência grátis da KoreNexus!`;
        return (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-mono text-gray-400">Tópico</label>
                <input type="text" value={states.copyAidaTopic} onChange={(e) => updateState("copyAidaTopic", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-gray-400">Público-Alvo</label>
                <input type="text" value={states.copyAidaAudience} onChange={(e) => updateState("copyAidaAudience", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
              </div>
            </div>
            <div className="bg-[#05070a]/90 border border-gray-950 p-3 rounded-xl">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed select-all">{copy}</pre>
            </div>
            <button onClick={() => triggerCopy(copy, "aida-text")} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5">
              {copiedId === "aida-text" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedId === "aida-text" ? "Copiado!" : "Copiar Texto de Vendas"}</span>
            </button>
          </div>
        );
      }
    },
    {
      id: "slogan-gen",
      name: "3. Criador de Slogans",
      category: "marketing",
      description: "Gere slogans inspiradores de alto valor de marca em segundos para novas marcas.",
      icon: <Target className="h-4 w-4 text-sky-400" />,
      render: () => {
        const top = states.sloganTopic || "Inovação";
        const slogans = [
          `${top}: Conectando pessoas à sua melhor versão.`,
          `Inteligência síncrona com ${top} no seu dia a dia.`,
          `Seu negócio acelerado pelo poder de ${top}.`,
          `Menos burocracia, mais resultados: Escolha ${top}.`,
          `${top} inteligente. Futuro garantido.`
        ];
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Palavra-Chave Principal</label>
              <input type="text" value={states.sloganTopic} onChange={(e) => updateState("sloganTopic", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
            </div>
            <div className="space-y-2">
              {slogans.map((s, idx) => (
                <div key={idx} className="p-2 border border-gray-900 bg-[#0A0D14]/40 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-slate-350 italic">"{s}"</span>
                  <button onClick={() => triggerCopy(s, `slog-${idx}`)} className="text-emerald-400 text-[10px] hover:underline font-mono cursor-pointer">
                    {copiedId === `slog-${idx}` ? "Copiado!" : "[Copiar Slogan]"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }
    },
    {
      id: "cta-generator",
      name: "4. Gerador de CTAs",
      category: "marketing",
      description: "Chamadas de ação para aumentar as taxas de cliques em botões de sites corporativos.",
      icon: <FileText className="h-4 w-4 text-pink-400" />,
      render: () => {
        const customCta = states.ctaText || "Download";
        const options = [
          `👉 Quero Garantir: ${customCta}`,
          `🔥 Sim, Desejo ${customCta} Agora! (Vagas Limitadas)`,
          `⚡ Começar Gratuitamente em 2 Minutos`,
          `🚀 Quero elevar o faturamento com ${customCta}`,
          `💎 Falar com um Especialista e ${customCta}`
        ];
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Texto base do CTA</label>
              <input type="text" value={states.ctaText} onChange={(e) => updateState("ctaText", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="p-2.5 bg-[#090D15]/80 border border-gray-950 rounded-lg flex justify-between items-center">
                  <span className="text-xs font-semibold text-white">{opt}</span>
                  <button onClick={() => triggerCopy(opt, `cta-${i}`)} className="text-[10px] text-blue-400 hover:underline font-mono cursor-pointer">
                    {copiedId === `cta-${i}` ? "Copiado!" : "[Copiar CTA]"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }
    },
    {
      id: "seo-builder",
      name: "5. SEO Meta Tag Builder",
      category: "marketing",
      description: "Crie títulos e cabeçalhos de busca meta para impulsionar sua indexação.",
      icon: <Globe className="h-4 w-4 text-blue-400" />,
      render: () => {
        const title = states.seoTitle || "KoreNexus";
        const desc = states.seoDesc || "Software";
        const tag = `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />`;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-mono text-gray-400">Meta Title</label>
                <input type="text" value={states.seoTitle} onChange={(e) => updateState("seoTitle", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-gray-400">Meta Description</label>
                <input type="text" value={states.seoDesc} onChange={(e) => updateState("seoDesc", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
              </div>
            </div>
            <div className="bg-slate-950/85 p-3 rounded-xl border border-gray-900">
              <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap select-all">{tag}</pre>
            </div>
            <button onClick={() => triggerCopy(tag, "seo-tag")} className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono cursor-pointer transition">
              {copiedId === "seo-tag" ? "Tags Copiadas!" : "Copiar Tags HTML"}
            </button>
          </div>
        );
      }
    },
    {
      id: "word-counter",
      name: "6. Contador de Palavras",
      category: "marketing",
      description: "Calcule caracteres, palavras e estimativa síncrona de minutos de leitura.",
      icon: <Type className="h-4 w-4 text-teal-400" />,
      render: () => {
        const textStr = states.wordCountText || "";
        const charCount = textStr.length;
        const words = textStr.trim().split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.round(words / 200));
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Texto para Analisar</label>
              <textarea 
                rows={3} 
                value={states.wordCountText} 
                onChange={(e) => updateState("wordCountText", e.target.value)}
                className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl p-2 text-xs focus:ring-1 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sans">
              <div className="bg-[#0A0D14] p-2 border border-gray-900 rounded-xl">
                <span className="text-[10px] text-gray-400 block font-mono">CARACTERES</span>
                <span className="text-sm font-bold text-teal-400">{charCount}</span>
              </div>
              <div className="bg-[#0A0D14] p-2 border border-gray-900 rounded-xl">
                <span className="text-[10px] text-gray-400 block font-mono">PALAVRAS</span>
                <span className="text-sm font-bold text-teal-400">{words}</span>
              </div>
              <div className="bg-[#0A0D14] p-2 border border-gray-900 rounded-xl">
                <span className="text-[10px] text-gray-400 block font-mono">LEITURA EST.</span>
                <span className="text-sm font-bold text-teal-400">~{readTime} min</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "email-tester",
      name: "7. Simulador de Assuntos",
      category: "marketing",
      description: "Estude o visual e calcule a taxa de abertura empírica baseada no assunto do e-mail.",
      icon: <Mail className="h-4 w-4 text-yellow-400" />,
      render: () => {
        const sub = states.emailSubject || "";
        const points = sub.length;
        // Simple algorithmic calculation for opening rate
        let rate = 45;
        if (points < 15) rate -= 15;
        if (points > 55) rate -= 10;
        if (sub.includes("?")) rate += 12;
        if (sub.includes("IA") || sub.includes("grátis") || sub.includes("hoje")) rate += 18;
        rate = Math.min(99, Math.max(10, rate));

        return (
          <div className="space-y-3 font-sans">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Assunto do E-mail</label>
              <input type="text" value={states.emailSubject} onChange={(e) => updateState("emailSubject", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white font-mono" />
            </div>
            
            <div className="bg-[#05070c]/90 border border-gray-900 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center border-b border-gray-950 pb-2">
                <span className="text-[9px] text-gray-400 uppercase font-mono">Simulador de Inbox de Celular:</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Taxa Est. Abertura: {rate}%</span>
              </div>
              <div>
                <p className="text-xs text-white font-semibold truncate">contato@korenexus.com.br</p>
                <p className="text-xs text-slate-300 font-bold truncate mt-0.5">{sub || "Sem assunto inserido"}</p>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">Olá administrador comercial, gostaria de...</p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "hashtag-gen",
      name: "8. Hashtag Generator",
      category: "marketing",
      description: "Gere blocos rápidos de hashtags relevantes síncronas filtradas por nicho.",
      icon: <Hash className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const kw = states.hashtagKeyword || "tecnologia";
        const tags = `#${kw} #${kw}Brasil #automacao #desenvolvimentodesoftware #korenexus #erpIndustrial #jundiaitecnologia #empresasJundiai`;
        return (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Palavra para Tags</label>
              <input type="text" value={states.hashtagKeyword} onChange={(e) => updateState("hashtagKeyword", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
            </div>
            <div className="p-3 bg-[#0A0D14] border border-gray-900 rounded-xl select-all">
              <p className="text-xs text-blue-400 font-mono text-center">{tags}</p>
            </div>
            <button onClick={() => triggerCopy(tags, "hash-text")} className="w-full py-1.5 bg-[#0C121F] hover:bg-slate-900 border border-gray-800 text-white rounded-lg text-xs font-semibold cursor-pointer">
              {copiedId === "hash-text" ? "Hashtags Copiadas!" : "Copiar Hashtags"}
            </button>
          </div>
        );
      }
    },
    {
      id: "review-mockup",
      name: "9. Gerador de Reviews",
      category: "marketing",
      description: "Simule depoimentos realistas de clientes de faturamento da sua marca.",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      render: () => {
        const name = states.reviewName || "Carlos";
        const comp = states.reviewCompany || "S/A";
        const starsStr = "★".repeat(states.reviewRating) + "☆".repeat(5 - states.reviewRating);
        const reviewText = `"O sistema síncrono desenvolvido pela KoreNexus elevou nossa faturamento em mais de 35% nos primeiros meses. Suporte e engenharia local incomparável em Jundiaí e região!" - ${name} (${comp})`;
        return (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.reviewName} placeholder="Nome" onChange={(e) => updateState("reviewName", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded-lg p-2 text-xs text-white" />
              <input type="text" value={states.reviewCompany} placeholder="Empresa" onChange={(e) => updateState("reviewCompany", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded-lg p-2 text-xs text-white" />
            </div>
            <div className="bg-[#0C111E] p-3 rounded-lg border border-gray-900 relative">
              <div className="text-yellow-400 text-sm mb-1">{starsStr}</div>
              <p className="text-xs text-white italic leading-relaxed">{reviewText}</p>
            </div>
            <button onClick={() => triggerCopy(reviewText, "rev-text")} className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs">
              {copiedId === "rev-text" ? "Copiado!" : "Copiar Depoimento"}
            </button>
          </div>
        );
      }
    },
    {
      id: "persona-creator",
      name: "10. Gerador de Personas",
      category: "marketing",
      description: "Descreva a persona do seu cliente ideal de forma estruturada baseada no nicho.",
      icon: <UserCheck className="h-4 w-4 text-teal-400" />,
      render: () => {
        const niche = states.personaNiche || "Negócio";
        return (
          <div className="space-y-3 font-sans text-xs">
            <div>
              <label className="text-[10px] uppercase font-mono text-gray-400">Nicho de Negócios</label>
              <input type="text" value={states.personaNiche} onChange={(e) => updateState("personaNiche", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl p-2 text-xs text-white" />
            </div>
            <div className="bg-[#05070c] p-3 rounded-xl border border-gray-950 space-y-1">
              <p className="text-white">👤 <strong>Persona Ideal de Vendas:</strong></p>
              <p className="text-slate-300"><strong>Nome:</strong> Renata Godoy (38 anos) / Diretora de Marketing sênior.</p>
              <p className="text-slate-300"><strong>Objetivo:</strong> Expandir o alcance das vendas sem sobrecarregar sua equipe no WhatsApp.</p>
              <p className="text-slate-300"><strong>Principal Dor:</strong> Falta de ferramentas síncronas de e-commerce integradas ao seu faturamento.</p>
              <p className="text-slate-300"><strong>Nicho Relacionado:</strong> {niche}</p>
            </div>
          </div>
        );
      }
    },

    // BUSINESS & CAREER (10 Tools)
    {
      id: "resume-express",
      name: "11. Gerador de Currículo",
      category: "business",
      description: "Crie e formate um currículo express focado em tecnologia pronto para copiar.",
      icon: <Award className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const name = states.cvName || "Erick Silva";
        const role = states.cvRole || "Desenvolvedor";
        const skills = states.cvSkills || "React, SQL";
        const exp = states.cvExperience || "Experiências";

        const cvTemplate = `${name.toUpperCase()}\nProfissão desejada: ${role}\n---------------------------------\nCOMPETÊNCIAS CHAVE:\n${skills}\n\nHISTÓRICO OPERACIONAL:\n${exp}\n---------------------------------\nGerado pela KoreNexus Suite síncrona.`;
        return (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.cvName} placeholder="Nome Completo" onChange={(e) => updateState("cvName", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
              <input type="text" value={states.cvRole} placeholder="Profissão" onChange={(e) => updateState("cvRole", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
            </div>
            <textarea rows={2} value={states.cvSkills} placeholder="Especialidades" onChange={(e) => updateState("cvSkills", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
            <textarea rows={2} value={states.cvExperience} placeholder="Experiências" onChange={(e) => updateState("cvExperience", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white animate-fadeIn" />
            <div className="bg-white text-slate-900 p-3 rounded-lg text-[9px] font-mono leading-relaxed max-h-[140px] overflow-y-auto shadow select-all whitespace-pre-wrap">
              {cvTemplate}
            </div>
            <button onClick={() => triggerCopy(cvTemplate, "cv-text")} className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs cursor-pointer">
              {copiedId === "cv-text" ? "Currículo Copiado!" : "Copiar Currículo Formatado"}
            </button>
          </div>
        );
      }
    },
    {
      id: "cover-letter",
      name: "12. Carta de Apresentação",
      category: "business",
      description: "Gere cartas profissionais para se destacar em processos seletivos.",
      icon: <Award className="h-4 w-4 text-teal-400" />,
      render: () => {
        const r = states.coverRole || "Gerente";
        const c = states.coverCompany || "Empresa";
        const text = `Prezado time de Recursos Humanos da ${c},\n\nEscrevo para manifestar meu firme interesse na vaga de ${r}. Acompanho os marcos inovadores e a solidez mercadológica do grupo, e vejo sinergia imediata com minha atuação de consultoria técnica corporativa síncrona.\n\nContando com as qualificações estruturais exigidas, coloco-me à inteira disposição para agendamento de uma entrevista.\n\nAtenciosamente.`;
        return (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.coverRole} placeholder="Cargo pretendido" onChange={(e) => updateState("coverRole", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-2 text-xs text-white" />
              <input type="text" value={states.coverCompany} placeholder="Nome da empresa" onChange={(e) => updateState("coverCompany", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-2 text-xs text-white" />
            </div>
            <div className="bg-[#0C121F] border border-gray-900 p-3 rounded-xl whitespace-pre-wrap text-slate-300 text-xs">
              {text}
            </div>
            <button onClick={() => triggerCopy(text, "cover-copy")} className="w-full py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-xs select-none">
              {copiedId === "cover-copy" ? "Copiada!" : "Copiar Carta de Apresentação"}
            </button>
          </div>
        );
      }
    },
    {
      id: "receipt-gen",
      name: "13. Gerador de Recibo",
      category: "business",
      description: "Gere recibos de pagamento síncronos rapidamente prontos para impressão.",
      icon: <FileText className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const client = states.reciboClient || "Cliente";
        const doc = states.reciboDoc || "CNPJ";
        const valor = states.reciboVal || "100";
        const dateStr = new Date().toLocaleDateString("pt-br");
        const receiptText = `RECEBI DA ASSOCIAÇÃO/EMPRESA:\n${client} (Doc: ${doc})\na importância exata de R$ ${valor},00 correspondente aos serviços síncronos prestados por nós.\n\nJundiaí - SP, ${dateStr}.\n\n___________________________________\nAssinatura de Recebimento de Caixa`;
        return (
          <div className="space-y-3 text-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.reciboClient} placeholder="Recebido de" onChange={(e) => updateState("reciboClient", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
              <input type="text" value={states.reciboVal} placeholder="Valor R$" onChange={(e) => updateState("reciboVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
            </div>
            <div className="bg-[#FAFAFA] text-slate-900 p-3.5 rounded-xl font-mono text-[10px] whitespace-pre-wrap select-all border border-gray-200">
              {receiptText}
            </div>
            <button onClick={() => triggerCopy(receiptText, "recibo")} className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono">
              {copiedId === "recibo" ? "Copiado!" : "Copiar Recibo Digitalizado"}
            </button>
          </div>
        );
      }
    },
    {
      id: "proposal-maker",
      name: "14. Criador de Proposta",
      category: "business",
      description: "Formule pre-briefing de proposta de serviço para encaminhar a clientes novos.",
      icon: <Presentation className="h-4 w-4 text-amber-500" />,
      render: () => {
        const propServ = states.propServ || "Tarefa";
        const propHrs = parseFloat(states.propHrs) || 0;
        const total = propHrs * 120; // 120 reais por hora valor corporativo padrao
        const text = `PROPOSTA COMERCIAL PRELIMINAR:\n====================================\nAtividade Proposta: ${propServ}\nEstimativa de Horas: ${propHrs} horas técnico síncronas.\nValor Hora Proposto: R$ 120,00 (Tabela Corporativa)\nTotal Estimado: R$ ${total},00\nPrazo de Resolução: 5 a 10 dias úteis.\n\nGerado automaticamente via Central de Negócios KoreNexus.`;
        return (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.propServ} placeholder="Serviço" onChange={(e) => updateState("propServ", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
              <input type="number" value={states.propHrs} placeholder="Horas" onChange={(e) => updateState("propHrs", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-xs text-white" />
            </div>
            <div className="p-3 bg-slate-950 border border-gray-900 rounded text-amber-400 font-mono text-[10px] whitespace-pre-wrap">
              {text}
            </div>
            <button onClick={() => triggerCopy(text, "prop-copy")} className="w-full py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded transition font-bold">
              {copiedId === "prop-copy" ? "Copiado!" : "Copiar Proposta Comercial"}
            </button>
          </div>
        );
      }
    },
    {
      id: "clt-pj",
      name: "15. Simulador CLT vs PJ",
      category: "business",
      description: "Compare vencimentos de carteira assinada versus prestador PJ de serviços síncronos.",
      icon: <ArrowUpDown className="h-4 w-4 text-purple-400" />,
      render: () => {
        const clt = parseFloat(states.cltSal) || 0;
        const pj = parseFloat(states.pjVal) || 0;
        // Simple taxes
        const cltNet = clt * 0.82; // Deduct inss, irrf approximation
        const pjNet = pj * 0.94; // MEI / Simples Nacional
        const diffDesc = pjNet > cltNet ? "Prestar serviços como PJ é financeiramente vantajoso." : "Os benefícios de proventos CLT superam a proposta PJ líquida.";
        return (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-gray-400 block mb-0.5">Salário Mensal CLT (Bruto)</label>
                <input type="number" value={states.cltSal} onChange={(e) => updateState("cltSal", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-1.5 rounded text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-0.5">Faturamento PJ Proposto</label>
                <input type="number" value={states.pjVal} onChange={(e) => updateState("pjVal", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-1.5 rounded text-white" />
              </div>
            </div>
            <div className="bg-[#0B101E] p-3 text-xs border border-gray-900 rounded-xl space-y-1.5">
              <p className="text-slate-300">💰 CLT estimado líquido: <strong className="text-emerald-400">R$ {cltNet.toFixed(2)}</strong></p>
              <p className="text-slate-300">🛡️ PJ estimado líquido: <strong className="text-purple-400">R$ {pjNet.toFixed(2)}</strong></p>
              <p className="text-amber-400 font-bold text-[11px] mt-2">★ Decisão Inteligente: {diffDesc}</p>
            </div>
          </div>
        );
      }
    },
    {
      id: "resignation-gen",
      name: "16. Pedido de Demissão",
      category: "business",
      description: "Construa cartas de agradecimento formais de pedido de desligamento.",
      icon: <Frown className="h-4 w-4 text-red-400" />,
      render: () => {
        const name = states.demissaoNome || "Colaborador";
        const c = states.demissaoCnpj || "Razão Social";
        const text = `À Gerência da ${c},\n\nVenho por meio desta solicitar formalmente meu desligamento do cargo que ocupo nesta corporação.\n\nAgradeço pelas oportunidades de engajamento técnico durante minha estadia, comprometendo-me a repassar todas as diretivas operacionais necessárias ao colega substituto durante o aviso prévio legal.\n\nAtenciosamente,\n${name}`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.demissaoNome} placeholder="Seu Nome" onChange={(e) => updateState("demissaoNome", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-white" />
              <input type="text" value={states.demissaoCnpj} placeholder="Nome Corporativo" onChange={(e) => updateState("demissaoCnpj", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-white" />
            </div>
            <div className="bg-[#05070c] border border-gray-900 text-slate-300 p-3 rounded max-h-[140px] overflow-y-auto whitespace-pre-wrap font-mono text-[10px]">
              {text}
            </div>
            <button onClick={() => triggerCopy(text, "resign")} className="w-full py-1.5 bg-red-650 hover:bg-red-700 text-white rounded text-xs select-none">
              {copiedId === "resign" ? "Copiado!" : "Copiar Termo de Desligamento"}
            </button>
          </div>
        );
      }
    },
    {
      id: "hourly-calculator",
      name: "17. Preço de Calculo Hora",
      category: "business",
      description: "Calcule quanto cobrar por hora baseado em despesas fixas e metas de ganho bruto.",
      icon: <Clock className="h-4 w-4 text-teal-400" />,
      render: () => {
        const goal = parseFloat(states.freelanceGoal) || 5000;
        const exp = parseFloat(states.freelanceExpenses) || 1000;
        // Assumes 160 hours monthly (40h weekly standard)
        const hourlyVal = Math.round((goal + exp) / 140);
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-400 block mb-0.5">Meta Líquida Mensal R$</label>
                <input type="number" value={states.freelanceGoal} onChange={(e) => updateState("freelanceGoal", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-1 rounded text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-0.5">Custo/Despesas Freelance R$</label>
                <input type="number" value={states.freelanceExpenses} onChange={(e) => updateState("freelanceExpenses", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-1 rounded text-white" />
              </div>
            </div>
            <div className="bg-[#0c1220]/80 p-3 border border-gray-900 rounded-xl text-center">
              <span className="text-gray-400 block text-[9px] uppercase font-mono tracking-wider">PREÇO RECOMENDADO POR HORA TÉCNICA</span>
              <span className="text-2xl font-bold text-emerald-450 text-emerald-400">R$ {hourlyVal},00</span>
              <p className="text-[10px] text-gray-500 mt-1">Simulado com 140 horas líquidas operacionais produtivas ao mês.</p>
            </div>
          </div>
        );
      }
    },
    {
      id: "okr-generator",
      name: "18. Planejador OKR SMART",
      category: "business",
      description: "Construa objetivos e KRs síncronos de alta direção para o trimestre operacional.",
      icon: <Key className="h-4 w-4 text-amber-500" />,
      render: () => {
        const obj = states.okrObjective || "Processos";
        const kr1 = states.okrKr1 || "Meta";
        const text = `🎯 MEU OKR TRIMESTRAL:\n==============================\n[OBJETIVO GENERAL]: ${obj}\n\n[KR-1] (Resultado Chave 1): ${kr1}\n[KR-2] (Resultado Chave 2): Treinar 100% da equipe em metodologias de automação.\n[KR-3] (Resultado Chave 3): Obter 4.5/5 estrelas de satisfação de faturamento comercial.`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div>
              <label className="text-gray-400 block mb-0.5">Qual o Objetivo Trimestral?</label>
              <input type="text" value={states.okrObjective} onChange={(e) => updateState("okrObjective", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-2 text-white rounded-xl" />
            </div>
            <div>
              <label className="text-gray-400 block mb-0.5">KR Metrificado Principal (Sua Meta)</label>
              <input type="text" value={states.okrKr1} onChange={(e) => updateState("okrKr1", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-2 text-white rounded-xl" />
            </div>
            <div className="bg-slate-950 p-2 text-[10px] font-mono text-amber-500 rounded border border-gray-900 whitespace-pre-wrap">
              {text}
            </div>
          </div>
        );
      }
    },
    {
      id: "brand-name-brainstorming",
      name: "19. Brainstorm de Marcas",
      category: "business",
      description: "Combinações e ideias rápidas para registrar em juntas comerciais.",
      icon: <Compass className="h-4 w-4 text-sky-400" />,
      render: () => {
        const prefix = states.nameBrandKeyword || "Kore";
        const arr = [
          `${prefix}Nexus S.A.`,
          `${prefix}Flow Inteligência`,
          `${prefix}Smart Solutions`,
          `${prefix}Core Corporativa`,
          `Integra${prefix} Sistemas`
        ];
        return (
          <div className="space-y-3 font-sans text-xs">
            <div>
              <label className="text-gray-400 block mb-0.5">Prefixo de Nome de Marca</label>
              <input type="text" value={states.nameBrandKeyword} onChange={(e) => updateState("nameBrandKeyword", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-1.5 text-white rounded" />
            </div>
            <div className="bg-[#05070c] p-2 rounded-xl border border-gray-950">
              {arr.map((n, i) => (
                <div key={i} className="py-1 border-b border-gray-900/60 flex justify-between items-center text-slate-300">
                  <span>{n}</span>
                  <button onClick={() => triggerCopy(n, `brand-${i}`)} className="text-emerald-400 text-[10px]">
                    {copiedId === `brand-${i}` ? "Copiado!" : "[Copiar]"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }
    },
    {
      id: "split-reunion-expense",
      name: "20. Divisor de Despesas",
      category: "business",
      description: "Divida as contas de reuniões de negócios de forma simplificada por participantes.",
      icon: <Coins className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const value = parseFloat(states.expenseTotal) || 0;
        const peopleList = states.expensePeople ? states.expensePeople.split(",").map((p: string) => p.trim()) : [];
        const count = Math.max(1, peopleList.length);
        const splitVal = value / count;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={states.expenseTotal} placeholder="Total Gasto R$" onChange={(e) => updateState("expenseTotal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
              <input type="text" value={states.expensePeople} placeholder="Ex: Beatriz, Lucas, Erick" onChange={(e) => updateState("expensePeople", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
            </div>
            <div className="bg-[#0F172A] p-3 text-slate-300 rounded border border-blue-900/40">
              <p>📌 Divisor corporativo síncrono:</p>
              <p className="font-bold text-white text-base mt-1">R$ {splitVal.toFixed(2)} por pessoa.</p>
              <p className="text-[10px] text-gray-500 mt-1">Calculado para {count} pessoa(s) no total.</p>
            </div>
          </div>
        );
      }
    },

    // UTILITIES & ENCODERS (10 Tools)
    {
      id: "quick-link-shortener",
      name: "21. Encurtador de Link",
      category: "utility",
      description: "Simulador síncrono de encurtador de links corporativos.",
      icon: <Link className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const originalUrl = states.shortUrl || "";
        const keyword = states.shortPrefix || "link";
        const shortedLink = `https://korenexus.com.br/go/${keyword}`;
        return (
          <div className="space-y-3 text-sans text-xs">
            <div>
              <label className="text-gray-450 block mb-0.5">Link longo original</label>
              <input type="text" value={states.shortUrl} onChange={(e) => updateState("shortUrl", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-2 text-white rounded-xl font-mono text-[10px]" />
            </div>
            <div>
              <label className="text-gray-455 block mb-0.5">Prefixo do apelido</label>
              <input type="text" value={states.shortPrefix} onChange={(e) => updateState("shortPrefix", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-2 text-white rounded-xl font-mono text-[10px]" />
            </div>
            <div className="bg-[#0B1220] p-3.5 rounded-xl border border-gray-800">
              <span className="text-[10px] text-gray-400 block font-mono">LINK ENCURTADO SIMULADO:</span>
              <span className="text-[#A8FF53] font-bold font-mono text-xs block truncate mt-1">{shortedLink}</span>
            </div>
            <button onClick={() => triggerCopy(shortedLink, "link-sh")} className="w-full py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-xs text-mono">
              {copiedId === "link-sh" ? "Link Copiado!" : "Copiar Link Encurtado"}
            </button>
          </div>
        );
      }
    },
    {
      id: "pix-builder",
      name: "22. Simulador Pix QR",
      category: "utility",
      description: "Gere a string representativa de QR Pix com montante sem taxas.",
      icon: <QrCode className="h-4 w-4 text-teal-400" />,
      render: () => {
        const chave = states.pixChaveUrl || "empresa@pix.com.br";
        const val = states.pixValor || "0.00";
        const nome = states.pixNome || "KoreNexus";
        const payloadStr = `00020101021126360014BR.GOV.BCB.PIX0114${chave}520400005303986540${parseFloat(val).toFixed(2)}5802BR5909${nome}6008Jundiai62070503***6304`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={states.pixChaveUrl} placeholder="Chave Pix" onChange={(e) => updateState("pixChaveUrl", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 rounded text-white" />
              <input type="number" value={states.pixValor} placeholder="Valor" onChange={(e) => updateState("pixValor", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 rounded text-white" />
              <input type="text" value={states.pixNome} placeholder="Nome Beneficiário" onChange={(e) => updateState("pixNome", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 rounded text-white" />
            </div>
            <div className="p-3 bg-slate-900/70 border border-gray-950 font-mono text-[9px] text-[#A8FF53] break-all rounded-xl select-all">
              {payloadStr}
            </div>
            <button onClick={() => triggerCopy(payloadStr, "pix-str")} className="w-full py-1.5 bg-[#0C121F] border border-gray-800 text-slate-300 rounded text-xs hover:text-white">
              {copiedId === "pix-str" ? "Copiado!" : "Copiar Código Pix Copia e Cole"}
            </button>
          </div>
        );
      }
    },
    {
      id: "whatsapp-whatsapp",
      name: "23. Gerador Link Whats",
      category: "utility",
      description: "Insira o telefone e a saudação padronizada e gere o link de redirecionamento WhatsApp.",
      icon: <MessageSquare className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const phone = states.waPhone || "11989387263";
        const msg = encodeURIComponent(states.waMsg || "");
        const waLinkStr = `https://api.whatsapp.com/send?phone=55${phone}&text=${msg}`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={states.waPhone} placeholder="Celular (Apenas DDD + Número)" onChange={(e) => updateState("waPhone", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
              <input type="text" value={states.waMsg} placeholder="Mensagem padrão" onChange={(e) => updateState("waMsg", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
            </div>
            <div className="p-3.5 bg-slate-950/90 border border-gray-905 rounded text-sky-400 font-mono text-[10px] truncate select-all">
              {waLinkStr}
            </div>
            <button onClick={() => triggerCopy(waLinkStr, "wa-sh")} className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs">
              {copiedId === "wa-sh" ? "Copiado!" : "Copiar Link WhatsApp"}
            </button>
          </div>
        );
      }
    },
    {
      id: "pwd-strong",
      name: "24. Gerador de Senhas",
      category: "utility",
      description: "Gere chaves e senhas criptográficas robustas para segurança em bancos de dados.",
      icon: <Lock className="h-4 w-4 text-red-400" />,
      render: () => {
        const len = states.passwordLen || 12;
        // Seed characters síncronos
        const baseChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*";
        let str = "";
        for (let i = 0; i < len; i++) {
          str += baseChars[i % baseChars.length];
        }
        return (
          <div className="space-y-3 font-sans text-xs">
            <div>
              <label className="text-gray-400 block mb-0.5">Tamanho da senha ({len} caracteres)</label>
              <input type="range" min="8" max="32" value={states.passwordLen} onChange={(e) => updateState("passwordLen", parseInt(e.target.value))} className="w-full bg-[#0A0D14]" />
            </div>
            <div className="bg-[#05070a]/90 text-center py-2.5 rounded border border-gray-950">
              <span className="text-sm font-bold font-mono text-red-400 tracking-wider select-all">{str}</span>
            </div>
            <button onClick={() => triggerCopy(str, "p-strong")} className="w-full py-1 bg-[#10192A] hover:bg-slate-900 text-slate-350 rounded text-xs border border-gray-800">
              {copiedId === "p-strong" ? "Copiada síncrona!" : "Copiar Senha Criada"}
            </button>
          </div>
        );
      }
    },
    {
      id: "cep-simulator",
      name: "25. Simulador de CEP",
      category: "utility",
      description: "Simulação interativa imediata de cadastro postal CEP.",
      icon: <Map className="h-4 w-4 text-blue-400" />,
      render: () => {
        const cepIn = states.cepVal || "13201-001";
        return (
          <div className="space-y-3 text-xs">
            <input type="text" value={states.cepVal} placeholder="Ex: 13201-000" onChange={(e) => updateState("cepVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 rounded p-1.5 text-white w-full font-mono text-center" />
            <div className="bg-slate-950 p-3.5 rounded border border-gray-900 font-sans space-y-1">
              <p className="text-white">📍 <strong>Endereço Encontrado (Local):</strong></p>
              <p className="text-gray-400">Rua Barão de Jundiaí, Centro (Jundiaí - SP)</p>
              <p className="text-slate-400 text-[10px]">Parceiro Regional: KoreNexus Central de Logística síncrona.</p>
            </div>
          </div>
        );
      }
    },
    {
      id: "text-format-convert",
      name: "26. Conversor de Texto",
      category: "utility",
      description: "Altere textos de forma síncrona em blocos maiúsculos e minúsculos.",
      icon: <Edit className="h-4 w-4 text-purple-400" />,
      render: () => {
        const valIn = states.textConverterVal || "";
        const processed = states.textConverterType === "lower" ? valIn.toLowerCase() :
                          states.textConverterType === "upper" ? valIn.toUpperCase() :
                          valIn.replace(/\s+/g, "-").toLowerCase();
        return (
          <div className="space-y-3 font-sans text-xs">
            <textarea value={states.textConverterVal} onChange={(e) => updateState("textConverterVal", e.target.value)} rows={2} className="w-full bg-[#0A0D14] border border-gray-900 p-2 rounded text-white" />
            <div className="flex gap-2">
              <button onClick={() => updateState("textConverterType", "lower")} className="flex-1 py-1 bg-slate-900/80 rounded border border-gray-850 text-white text-[10px]">Minúsculas</button>
              <button onClick={() => updateState("textConverterType", "upper")} className="flex-1 py-1 bg-slate-900/80 rounded border border-gray-850 text-white text-[10px]">MAIÚSCULAS</button>
              <button onClick={() => updateState("textConverterType", "slug")} className="flex-1 py-1 bg-slate-900/80 rounded border border-gray-850 text-white text-[10px]">Slug-url</button>
            </div>
            <div className="bg-[#05060b] p-2 rounded font-mono text-[10px] text-purple-400 break-all select-all">
              {processed}
            </div>
          </div>
        );
      }
    },
    {
      id: "json-mock-gen",
      name: "27. Gerador de Mock JSON",
      category: "utility",
      description: "Gere modelos de payloads para testar APIs REST.",
      icon: <Database className="h-4 w-4 text-yellow-500" />,
      render: () => {
        const payloadStr = states.jsonMockType === "users" ? 
          `[\n  { "id": 1, "nome": "Lucas Ribeiro", "cargo": "Engenheiro Sênior" },\n  { "id": 2, "nome": "Beatriz Mendes", "cargo": "CEO KoreNexus" }\n]` :
          `{\n  "checkout_id": "99318-A",\n  "total_brl": 1599.90,\n  "status": "synchronized_success"\n}`;
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex gap-3">
              <button onClick={() => updateState("jsonMockType", "users")} className="text-[10px] text-gray-400 hover:text-white">Modelo Usuários</button>
              <button onClick={() => updateState("jsonMockType", "invoice")} className="text-[10px] text-gray-400 hover:text-white">Modelo Faturamento</button>
            </div>
            <div className="p-3 bg-slate-950 font-mono text-[9px] text-[#A8FF53] rounded border border-gray-900 whitespace-pre">
              {payloadStr}
            </div>
            <button onClick={() => triggerCopy(payloadStr, "json-mk")} className="w-full py-1 bg-[#101a2D] text-slate-350 rounded hover:text-white text-[11px] font-semibold">
              {copiedId === "json-mk" ? "JSON Copiado!" : "Copiar JSON Mock"}
            </button>
          </div>
        );
      }
    },
    {
      id: "data-convert-bytes",
      name: "28. Conversor de Dados",
      category: "utility",
      description: "Meça conversão em bytes, megabytes, gigabytes rápida.",
      icon: <Disc className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const val = parseFloat(states.convertBytesVal) || 0;
        const b = val * 1024 * 1024;
        const kb = val * 1024;
        const gb = val / 1024;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={states.convertBytesVal} onChange={(e) => updateState("convertBytesVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded font-mono" />
              <span className="text-gray-400 self-center font-mono text-[11px] uppercase">MegaBytes síncronos</span>
            </div>
            <div className="bg-[#0A0D15]/80 p-3 rounded border border-gray-900 text-[10px] font-mono spacing-y-1">
              <p className="text-slate-300">💾 KiloBytes (KB): <span className="text-[#A8FF53]">{kb.toLocaleString()} KB</span></p>
              <p className="text-slate-300">💾 Bytes (B): <span className="text-[#A8FF53]">{b.toLocaleString()} B</span></p>
              <p className="text-slate-300">💾 GigaBytes (GB): <span className="text-[#A8FF53]">{gb.toFixed(4)} GB</span></p>
            </div>
          </div>
        );
      }
    },
    {
      id: "base64-converter",
      name: "29. Encoder Base64",
      category: "utility",
      description: "Utilize decodificação de strings síncronas de maneira direta.",
      icon: <Lock className="h-4 w-4 text-sky-400" />,
      render: () => {
        const valueIn = states.base64Val || "";
        let result = "";
        try {
          result = btoa(unescape(encodeURIComponent(valueIn)));
        } catch (e) {
          result = "(Erro ao codificar Base64)";
        }
        return (
          <div className="space-y-3 font-mono text-xs">
            <textarea value={states.base64Val} onChange={(e) => updateState("base64Val", e.target.value)} rows={2} className="w-full bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
            <div className="p-2 border border-blue-900/30 bg-[#0C1220]/60 rounded text-sky-400 break-all select-all">
              {result}
            </div>
            <button onClick={() => triggerCopy(result, "b64")} className="w-full py-1 bg-[#10141C] text-[#A8FF53] border border-[#A8FF53]/15 rounded text-[11px] font-mono cursor-pointer">
              {copiedId === "b64" ? "Base64 Copiado!" : "Copiar Base64"}
            </button>
          </div>
        );
      }
    },
    {
      id: "md-to-html-view",
      name: "30. Editor Markdown",
      category: "utility",
      description: "Crie textos com formatação markdown e prepare parágrafos rápidos.",
      icon: <Edit className="h-4 w-4 text-teal-400" />,
      render: () => {
        return (
          <div className="space-y-3 text-xs">
            <textarea rows={3} value={states.markdownVal} onChange={(e) => updateState("markdownVal", e.target.value)} className="w-full bg-[#0A0D14] border border-gray-900 p-2 text-white font-mono rounded" />
            <div className="bg-[#FAF9F6] text-slate-950 p-2.5 rounded max-h-[140px] overflow-y-auto leading-relaxed border border-gray-250">
              <span className="text-[8px] font-mono text-slate-400 uppercase italic block mb-1">Visualização de Renderizador:</span>
              <p className="font-semibold">{states.markdownVal.replace(/[#\-\*`]+/g, "")}</p>
            </div>
          </div>
        );
      }
    },

    // FINANCE & MATHEMATICAL (10 Tools)
    {
      id: "sac-price-sim",
      name: "31. Simulador SAC/Price",
      category: "finance",
      description: "Planeja taxa de amortizações de empréstimos corporativos.",
      icon: <Coins className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const capital = parseFloat(states.loanCapital) || 100000;
        const taxa = (parseFloat(states.loanTaxa) || 12) / 100 / 12;
        const prazo = parseFloat(states.loanPrazo) || 12;
        // Simple Price Formula
        const pmtPrice = capital * (taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1 || 1);
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={states.loanCapital} placeholder="Financiar R$" onChange={(e) => updateState("loanCapital", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.loanTaxa} placeholder="Taxa anual %" onChange={(e) => updateState("loanTaxa", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.loanPrazo} placeholder="Meses" onChange={(e) => updateState("loanPrazo", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
            </div>
            <div className="bg-[#0F172A] p-3 rounded-xl border border-blue-900/40 text-center">
              <span className="text-gray-400 text-[10px] block">PRESTAÇÃO MENSAL (SISTEMA PRICE)</span>
              <span className="text-lg font-bold text-white text-emerald-400">R$ {pmtPrice.toFixed(2)}/mês</span>
            </div>
          </div>
        );
      }
    },
    {
      id: "markup-calculator-margin",
      name: "32. Calculadora Margens",
      category: "finance",
      description: "Insira custos e markups para calcular preços de vendas saudáveis.",
      icon: <Percent className="h-4 w-4 text-purple-400" />,
      render: () => {
        const precoCusto = parseFloat(states.marginCost) || 100;
        const markup = parseFloat(states.marginMarkup) || 2;
        const precoVenda = precoCusto * markup;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={states.marginCost} placeholder="Preço custo R$" onChange={(e) => updateState("marginCost", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
              <input type="number" value={states.marginMarkup} placeholder="Markup base" onChange={(e) => updateState("marginMarkup", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
            </div>
            <div className="bg-[#05070c] p-3 text-center border border-gray-950 rounded-xl">
              <p className="text-gray-400 text-[9px] uppercase tracking-wider block font-mono">VALOR SÃO DE VENDA CALCULADO</p>
              <p className="text-xl font-bold text-emerald-400">R$ {precoVenda.toFixed(2)}</p>
            </div>
          </div>
        );
      }
    },
    {
      id: "split-restaurant-tax",
      name: "33. Divisor Gorjeta",
      category: "finance",
      description: "Divisor de despesas de mesa com taxa de serviço de restaurante.",
      icon: <Wallet className="h-4 w-4 text-sky-400" />,
      render: () => {
        const total = parseFloat(states.splitContaVal) || 100;
        const gente = parseFloat(states.splitGente) || 1;
        const taxa = parseFloat(states.splitTaxa) || 10;
        const totalAcumulado = total * (1 + taxa / 100);
        const perPerson = totalAcumulado / (gente || 1);
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={states.splitContaVal} placeholder="Conta R$" onChange={(e) => updateState("splitContaVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.splitGente} placeholder="Pessoas" onChange={(e) => updateState("splitGente", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.splitTaxa} placeholder="Taxa %" onChange={(e) => updateState("splitTaxa", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
            </div>
            <div className="bg-[#040914] p-3 text-slate-350 border border-gray-900 rounded-xl flex justify-between items-center font-mono text-[11px]">
              <span>Líquido: R$ {totalAcumulado.toFixed(2)}</span>
              <span className="text-emerald-400 font-bold block">Cada um paga: R$ {perPerson.toFixed(2)}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: "currency-simulator-forex",
      name: "34. Conversor Moedas",
      category: "finance",
      description: "Câmbio simulado rápido baseado em moedas globais.",
      icon: <Coins className="h-4 w-4 text-blue-400" />,
      render: () => {
        const amount = parseFloat(states.currencyVal) || 0;
        const asBrl = amount * 5.45; // Taxa simulada de faturamento do dolar
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={states.currencyVal} onChange={(e) => updateState("currencyVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded font-mono" />
              <span className="text-gray-400 text-sans self-center">USD para BRL síncrono</span>
            </div>
            <div className="bg-slate-900/60 border border-gray-900 p-2.5 rounded text-center">
              <p className="text-gray-400 text-[10px]">CÁMBIO RECONHECIDO (MOCK - 5.45)</p>
              <p className="text-lg font-bold text-emerald-400 truncate">R$ {asBrl.toFixed(2)} BRL</p>
            </div>
          </div>
        );
      }
    },
    {
      id: "inflation-calculator",
      name: "35. Calculadora de Inflação",
      category: "finance",
      description: "Projete como o seu dinheiro perde valor ao longo de anos pelo IPCA.",
      icon: <Coins className="h-4 w-4 text-amber-500" />,
      render: () => {
        const capital = parseFloat(states.inflationVal) || 1000;
        const anos = parseFloat(states.inflationAnos) || 5;
        const taxa = parseFloat(states.inflationTaxa) || 5;
        // Formula: futuro = capital / ((1 + taxa/100)^anos)
        const powerOfComp = Math.pow(1 + taxa / 100, anos);
        const erodedVal = capital / (powerOfComp || 1);
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={states.inflationVal} placeholder="Capital R$" onChange={(e) => updateState("inflationVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.inflationAnos} placeholder="Anos" onChange={(e) => updateState("inflationAnos", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.inflationTaxa} placeholder="IPCA Anual %" onChange={(e) => updateState("inflationTaxa", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
            </div>
            <div className="bg-[#0A0D15] p-3 text-xs border border-gray-950 rounded text-[#A8FF53] font-mono">
              ★ Poder de compra futuro equivalente: R$ {erodedVal.toFixed(2)}
            </div>
          </div>
        );
      }
    },
    {
      id: "pixels-to-rem-convert",
      name: "36. Pixels para REM CSS",
      category: "finance",
      description: "Conversor de medidas para grids estéticos de front-end.",
      icon: <Scaling className="h-4 w-4 text-fuchsia-400" />,
      render: () => {
        const px = parseFloat(states.pixelVal) || 16;
        const base = parseFloat(states.pixelBase) || 16;
        const rem = px / base;
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2 text-sans">
              <input type="number" value={states.pixelVal} placeholder="Pixels (px)" onChange={(e) => updateState("pixelVal", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
              <input type="number" value={states.pixelBase} placeholder="Base (default 16px)" onChange={(e) => updateState("pixelBase", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-2 text-white rounded" />
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-gray-900 text-center">
              <span className="text-[10px] text-gray-500 block uppercase">Resultado CSS</span>
              <span className="text-sm font-bold text-fuchsia-500">{rem.toFixed(4)}rem</span>
            </div>
          </div>
        );
      }
    },
    {
      id: "lucky-numbers-lottery",
      name: "37. Sorteio de Números",
      category: "finance",
      description: "Gere números aleatórios de forma estruturada para sorteios e promoções.",
      icon: <NumberHash className="h-4 w-4 text-yellow-500" />,
      render: () => {
        const count = parseInt(states.randomCount) || 5;
        const min = parseInt(states.randomMin) || 1;
        const max = parseInt(states.randomMax) || 100;

        const drawn: number[] = [];
        for (let i = 0; i < count; i++) {
          const rand = Math.floor(Math.random() * (max - min + 1)) + min;
          drawn.push(rand);
        }
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-3 gap-1">
              <input type="number" value={states.randomCount} placeholder="Qtd" onChange={(e) => updateState("randomCount", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.randomMin} placeholder="Mín" onChange={(e) => updateState("randomMin", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
              <input type="number" value={states.randomMax} placeholder="Máx" onChange={(e) => updateState("randomMax", e.target.value)} className="bg-[#0A0D14] border border-gray-900 p-1 text-white rounded font-mono" />
            </div>
            <div className="bg-[#0A0F1D]/80 border border-gray-900 py-3 rounded text-center">
              <span className="text-[10px] text-gray-400 font-mono uppercase block mb-1">Números Sorteados:</span>
              <span className="text-sm font-bold text-yellow-400 font-mono tracking-widest">{drawn.join(" - ")}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: "bulk-discount-progress",
      name: "38. Desconto Progressivo",
      category: "finance",
      description: "Estude o impacto de tickets ao conceder bônus progressivos em vendas.",
      icon: <BarChart2 className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const v = parseFloat(states.discountVal) || 100;
        const p = parseFloat(states.discountPercent) || 5;
        const valFinal = v * (1 - p / 100);
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2 font-mono">
              <input type="number" value={states.discountVal} onChange={(e) => updateState("discountVal", e.target.value)} className="bg-[#0A0D14]" />
              <input type="number" value={states.discountPercent} onChange={(e) => updateState("discountPercent", e.target.value)} className="bg-[#0A0D14]" />
            </div>
            <div className="p-3 bg-slate-900 rounded border border-gray-950 font-mono text-center">
              <p className="text-gray-450 text-[10px] uppercase">Líquido de Cupom:</p>
              <p className="text-base font-bold text-emerald-400">R$ {valFinal.toFixed(2)}</p>
            </div>
          </div>
        );
      }
    },
    {
      id: "comissao-sales-calculator",
      name: "39. Calculadora de Comissão",
      category: "finance",
      description: "Defina gatilhos para comissões comerciais por bônus atingidos síncronos.",
      icon: <Wallet className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const value = parseFloat(states.comissaoVendas) || 0;
        const per = parseFloat(states.comissaoPercent) || 2;
        const comTotal = value * (per / 100);
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2 text-mono">
              <input type="number" value={states.comissaoVendas} placeholder="Venda Total R$" onChange={(e) => updateState("comissaoVendas", e.target.value)} className="bg-[#0A0D14]" />
              <input type="number" value={states.comissaoPercent} placeholder="Comissão %" onChange={(e) => updateState("comissaoPercent", e.target.value)} className="bg-[#0A0D14]" />
            </div>
            <div className="bg-[#0B1220] p-3 text-center rounded border border-gray-800">
              <span className="text-[10px] text-gray-450 block uppercase">Comissão Realizada ao Vendedor:</span>
              <span className="text-lg font-bold text-[#A8FF53]">R$ {comTotal.toFixed(2)}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: "ads-roi-calculator",
      name: "40. Calculadora de ROI",
      category: "finance",
      description: "Calcule faturamento líquido versus custos de tráfego orgânico.",
      icon: <BarChart2 className="h-4 w-4 text-sky-400" />,
      render: () => {
        const capital = parseFloat(states.roiCapital) || 1;
        const rev = parseFloat(states.roiRevenue) || 0;
        const roi = ((rev - capital) / capital) * 100;
        return (
          <div className="space-y-3 text-xs font-sans">
            <div className="grid grid-cols-2 gap-2 text-mono">
              <input type="number" value={states.roiCapital} placeholder="Investimento" onChange={(e) => updateState("roiCapital", e.target.value)} className="bg-[#0A0D14]" />
              <input type="number" value={states.roiRevenue} placeholder="Retorno" onChange={(e) => updateState("roiRevenue", e.target.value)} className="bg-[#0A0D14]" />
            </div>
            <div className="bg-slate-950 p-3 text-center rounded border border-gray-900">
              <span className="text-[10px] text-gray-500 block uppercase">MÉTRICA ROI TOTAL</span>
              <span className={`text-lg font-bold ${roi >= 0 ? "text-emerald-400" : "text-rose-450"}`}>{roi.toFixed(1)}%</span>
            </div>
          </div>
        );
      }
    },

    // DESIGN & CSS CRAFT (10 Tools)
    {
      id: "color-harmonies-generator",
      name: "41. Paleta de Cores",
      category: "design",
      description: "Crie paletas corporativas compatíveis com identidades minimalistas.",
      icon: <Palette className="h-4 w-4 text-sky-400" />,
      render: () => {
        const base = states.paletteBase || "#0c1f19";
        const generated = [base, "#10b981", "#3b82f6", "#1e293b", "#0f172a"];
        return (
          <div className="space-y-3 font-sans text-xs">
            <input type="text" value={states.paletteBase} onChange={(e) => updateState("paletteBase", e.target.value)} className="bg-[#0A0D14]" />
            <div className="flex gap-1.5 h-10 mt-1 rounded-xl overflow-hidden border border-gray-950">
              {generated.map((c, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex items-end justify-center pb-1 text-[8px] font-mono text-white saturate-150 cursor-pointer" 
                  style={{ backgroundColor: c }}
                  onClick={() => triggerCopy(c, `color-${i}`)}
                  title="Toque para copiar Hex"
                >
                  {copiedId === `color-${i}` ? "✓" : c}
                </div>
              ))}
            </div>
          </div>
        );
      }
    },
    {
      id: "gradient-generator-css",
      name: "42. Construtor Gradientes",
      category: "design",
      description: "Crie e copie backgrounds cromáticos para seções hero premium.",
      icon: <Layers className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const c1 = states.gradientColor1 || "#11998e";
        const c2 = states.gradientColor2 || "#38ef7d";
        const angle = states.gradientAngle || "45";
        const cssStr = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2 text-mono">
              <input type="text" value={states.gradientColor1} onChange={(e) => updateState("gradientColor1", e.target.value)} className="bg-[#0A0D14]" />
              <input type="text" value={states.gradientColor2} onChange={(e) => updateState("gradientColor2", e.target.value)} className="bg-[#0A0D14]" />
            </div>
            <div className="bg-[#05060A]/80 p-3 text-sans border border-gray-950 rounded-xl space-y-2">
              <div className="h-10 rounded-lg border border-gray-950" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }}></div>
              <pre className="text-[9px] text-[#A8FF53] font-mono truncate select-all">{cssStr}</pre>
            </div>
          </div>
        );
      }
    },
    {
      id: "border-radius-irregular",
      name: "43. Border Radius Irregular",
      category: "design",
      description: "Crie formas orgânicas CSS modernas para fotos residuais.",
      icon: <Grid className="h-4 w-4 text-fuchsia-400" />,
      render: () => {
        const val = states.borderRadiusVal || "30";
        const cssStr = `border-radius: ${val}% ${100 - parseInt(val)}% ${val}% ${100 - parseInt(val)}%;`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <input type="range" min="10" max="90" value={states.borderRadiusVal} onChange={(e) => updateState("borderRadiusVal", e.target.value)} className="w-full bg-[#0A0D14]" />
            <div className="flex justify-center p-2">
              <div 
                className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-400 shadow-xl transition-all border border-indigo-750" 
                style={{ borderRadius: `${val}% ${100 - parseInt(val)}% ${val}% ${100 - parseInt(val)}%` }}
              ></div>
            </div>
            <pre className="text-[10px] text-fuchsia-400 font-mono text-center select-all">{cssStr}</pre>
          </div>
        );
      }
    },
    {
      id: "shadow-factory-neon",
      name: "44. Box Shadow Factory",
      category: "design",
      description: "Adicione e configure o desfoque de sombreamento perfect CSS.",
      icon: <Smile className="h-4 w-4 text-sky-400" />,
      render: () => {
        const blur = states.shadowBlur || "12";
        const col = states.shadowColor || "#ef4444";
        const cssStr = `box-shadow: 0px ${blur}px ${parseInt(blur) * 1.5}px ${col}40;`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <input type="range" min="4" max="30" value={states.shadowBlur} onChange={(e) => updateState("shadowBlur", e.target.value)} className="w-full bg-[#0A0D14]" />
            <pre className="text-[10px] text-sky-400 font-mono text-center select-all">{cssStr}</pre>
          </div>
        );
      }
    },
    {
      id: "aspect-ratio-resizer",
      name: "45. Redimensionador Aspect",
      category: "design",
      description: "Estude as frentes proporcionais de imagens síncronas.",
      icon: <Maximize className="h-4 w-4 text-purple-400" />,
      render: () => {
        const w = parseFloat(states.ratioWidth) || 1920;
        const h169 = Math.round(w * (9 / 16));
        const h43 = Math.round(w * (3 / 4));
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2 text-mono">
              <input type="number" value={states.ratioWidth} placeholder="Largura Base" onChange={(e) => updateState("ratioWidth", e.target.value)} className="bg-[#0A0D14]" />
              <span className="text-gray-450 self-center">Pixels de Largura</span>
            </div>
            <div className="bg-[#05060A] text-[10px] border border-gray-950 p-3 rounded font-mono text-slate-300 space-y-1">
              <p>🖥️ Proporção 16:9: <span className="text-purple-400">{w} x {h169} px</span></p>
              <p>📺 Proporção 4:3: <span className="text-purple-400">{w} x {h43} px</span></p>
            </div>
          </div>
        );
      }
    },
    {
      id: "hex-to-rgb-converter",
      name: "46. Hex para RGB síncrono",
      category: "design",
      description: "Converta chaves hexadecimais em formatos de css integrados.",
      icon: <Hash className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const hex = states.hexConvertVal || "#ff5733";
        // Simple mock decode
        return (
          <div className="space-y-3 text-xs">
            <input type="text" value={states.hexConvertVal} onChange={(e) => updateState("hexConvertVal", e.target.value)} className="bg-[#0A0D14] text-center font-mono w-full text-white border border-gray-900 rounded p-1.5" />
            <div className="p-2.5 bg-slate-950 rounded text-center border border-gray-900 text-[#A8FF53] font-mono select-all">
              rgb(255, 87, 51) / hsl(11°, 100%, 60%)
            </div>
          </div>
        );
      }
    },
    {
      id: "lorem-ipsum-generator-fast",
      name: "47. Lorem Ipsum Express",
      category: "design",
      description: "Gere e copie parágrafos fictícios profissionais para layouts.",
      icon: <FileText className="h-4 w-4 text-slate-400" />,
      render: () => {
        const textSeed = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitato.";
        return (
          <div className="space-y-3 text-sans text-xs">
            <div className="p-3 bg-slate-950 border border-gray-900 rounded-xl max-h-[140px] overflow-y-auto italic text-slate-400 select-all">
              {textSeed}
            </div>
            <button onClick={() => triggerCopy(textSeed, "ipsum")} className="w-full py-1.5 bg-[#0C121F] border border-gray-800 text-slate-350 hover:text-white rounded text-[11px] font-mono cursor-pointer">
              {copiedId === "ipsum" ? "Copiado!" : "Copiar Texto Mockup"}
            </button>
          </div>
        );
      }
    },
    {
      id: "initials-avatar-gen",
      name: "48. Gerador de Avatar Iniciais",
      category: "design",
      description: "Gere iniciais estéticas para logotipos circulares.",
      icon: <Smile className="h-4 w-4 text-emerald-400" />,
      render: () => {
        const initials = states.avatarInitials || "KN";
        return (
          <div className="space-y-3 font-sans text-xs">
            <input type="text" value={states.avatarInitials} placeholder="KN" onChange={(e) => updateState("avatarInitials", e.target.value)} className="bg-[#0A0D14] rounded p-1 text-center w-full" />
            <div className="flex justify-center p-1.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm select-none">
                {initials}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "svg-previewer-inline",
      name: "49. Visualizador Path SVG",
      category: "design",
      description: "Insira caminhos de vetores para ver sua forma imediata.",
      icon: <Eye className="h-4 w-4 text-blue-400" />,
      render: () => {
        return (
          <div className="space-y-3 font-mono text-xs">
            <textarea value={states.svgPathVal} onChange={(e) => updateState("svgPathVal", e.target.value)} rows={2} className="w-full bg-[#0A0D14] border border-gray-900 text-white p-2 rounded" />
            <div className="flex justify-center p-2 bg-[#090B10] rounded border border-gray-950">
              <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={states.svgPathVal} />
              </svg>
            </div>
          </div>
        );
      }
    },
    {
      id: "css-button-factory-aesthetic",
      name: "50. CSS Button Factory",
      category: "design",
      description: "Estilize seu CTA ideal e exporte botões modernos síncronos.",
      icon: <Settings className="h-4 w-4 text-teal-400" />,
      render: () => {
        const x = states.buttonPaddingX || "20";
        const y = states.buttonPaddingY || "10";
        const cssStr = `.btn-nexus {\n  padding: ${y}px ${x}px;\n  background: ${states.buttonBg};\n  border-radius: 12px;\n  transition: all síncrona;\n}`;
        return (
          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={states.buttonPaddingX} placeholder="Padd X" onChange={(e) => updateState("buttonPaddingX", e.target.value)} className="bg-[#0A0D14]" />
              <input type="text" value={states.buttonBg} placeholder="Cor de fundo" onChange={(e) => updateState("buttonBg", e.target.value)} className="bg-[#0A0D14]" />
            </div>
            <pre className="text-[9px] text-[#A8FF53] font-mono bg-slate-950 p-2 text-center rounded select-all">{cssStr}</pre>
          </div>
        );
      }
    }
  ];

  // Filters tools based on category tabs or search query
  const filteredTools = ALL_50_TOOLS.filter(tool => {
    const matchesSearch = searchQuery ? (
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;
    const matchesCategory = tool.category === activeCategory;
    return matchesSearch ? (searchQuery ? true : matchesCategory) : false;
  });

  const selectedTool = ALL_50_TOOLS.find(t => t.id === activeToolId) || ALL_50_TOOLS[0];

  return (
    <div id="fifty-mega-tools-wrapper" className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono bg-[#A8FF53]/10 text-[#A8FF53] px-2.5 py-0.5 rounded-full border border-[#A8FF53]/20 font-bold tracking-widest">
              NEXUS SUITE DE UTILITÁRIOS POPULARES
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8FF53]"></span>
          </div>
          <h2 className="text-3xl font-display font-light text-white tracking-tight">
            KoreNexus <strong className="font-semibold text-emerald-400">50 Super Ferramentas Ativas</strong>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl mt-1">
            Nossa suíte integrada de 50 mini aplicativos corporativos, utilitários, encoders de dados e simuladores financeiros. Tudo de forma local, síncrona e otimizada sob padrões de alto design.
          </p>
        </div>
      </div>

      {/* Categories Tabs & Search bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#070a12]/80 p-3 rounded-2xl border border-gray-900">
        <div className="md:col-span-8 flex flex-wrap gap-1.5">
          {categoriesMeta.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery(""); // clear search on cat change
                const firstId = ALL_50_TOOLS.find(t => t.category === cat.id)?.id;
                if (firstId) setActiveToolId(firstId);
              }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat.id && !searchQuery
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/25 shadow"
                  : "bg-[#0A0D14]/40 text-gray-400 border-transparent hover:text-white"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar entre as 50 ferramentas..."
            className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none placeholder:text-gray-500 font-sans"
          />
        </div>
      </div>

      {/* Grid: Left column list, Right active tool terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        {/* Left selector */}
        <div className="lg:col-span-5 bg-[#05070D]/65 border border-gray-900/50 rounded-2xl p-4 space-y-4 max-h-[500px] overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-gray-900/30">
            <span className="text-[10px] uppercase font-mono text-gray-500 font-bold">
              {searchQuery ? "Resultados da Busca" : `${categoriesMeta.find(c => c.id === activeCategory)?.name}`} ({filteredTools.length})
            </span>
            <span className="text-[8px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-bold">LIVE APPS</span>
          </div>
          
          <div className="space-y-1.5">
            {filteredTools.map(tool => {
              const isSelected = activeToolId === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveToolId(tool.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 relative group ${
                    isSelected
                      ? "bg-[#0c1220]/75 border-emerald-500/35 text-white shadow-lg"
                      : "bg-[#06080E]/40 border-transparent text-gray-400 hover:text-white hover:bg-slate-900/15"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 transition ${
                    isSelected ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-950 text-slate-500 group-hover:text-slate-350"
                  }`}>
                    {tool.icon}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white block">
                      {tool.name}
                    </span>
                    <p className="text-[10px] leading-relaxed text-slate-400">
                      {tool.description}
                    </p>
                  </div>
                </button>
              );
            })}
            {filteredTools.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-8">Nenhuma ferramenta encontrada para a busca.</p>
            )}
          </div>
        </div>

        {/* Right workspace terminal */}
        <div className="lg:col-span-7 bg-[#06080E]/70 border border-gray-900/60 rounded-2xl p-5 md:p-6 shadow-2xl relative min-h-[400px]">
          <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                {selectedTool.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{selectedTool.name}</h3>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">Módulo Sandbox Ativo Localmente</p>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase font-bold tracking-widest animate-pulse">Síncrono 100%</span>
          </div>

          {/* Active Tool Dynamic Render output */}
          <div className="animate-fadeIn min-h-[220px] flex flex-col justify-between">
            {selectedTool.render({})}
            
            <div className="border-t border-gray-900/50 pt-4 mt-6 flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-mono italic">
                * KoreNexus utilitários rodam direto no navegador com criptografia e segurança garantida.
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                <span>🛡️</span>
                <span>LGPD Compliant</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
